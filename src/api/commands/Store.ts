import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, CacheType, CommandInteraction, ComponentType, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction, StringSelectMenuOptionBuilder } from "discord.js";
import { Store as DBStore, IStore, ItemType, Rarity } from "../../database/models/Store";
import Command from "./Command";
import { checkDisable, createNormalButton, createPagination, createSuccessButton, updateConfirmation } from "../../util/InteractionUtils";
import { getBadgeView } from "../../util/ImageUtils";
import UserController from "../../database/controllers/UserController";
import { botConfig } from "../../app";
import { IUser } from "../../database/models/User";
import mongoose, { ObjectId } from "mongoose";
import { cooldownCheck } from "../../util/DateUtils";


export default abstract class Store extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("store")
        .setDescription("Sua loja diária")


    static async execute(interaction: CommandInteraction<CacheType>) {

        await interaction.deferReply({});

        let user = await UserController.getUserById(interaction.user.id);

        if (!user) return await interaction.editReply({ content: `${botConfig.CONFUSED} | <@${interaction.user.id}>, Tente realizar suas tarefas diárias primeiro.` });

        await Store.storeView(interaction, user);

    }

    static async storeView(interaction: CommandInteraction, user: IUser) {

        let canReset = cooldownCheck(24, user?.storeDate).allowed;
        let resetTime = cooldownCheck(24, user?.storeDate).time;

        let store: IStore[] = canReset ? await Store.getStore() : await UserController.getUserStore(user);
        user.store = store.map((item) => item._id);

        const notOnInventory = (item: IStore) => user?.inventory?.indexOf(item?._id) == -1;

        if (store.length == 0) return await interaction.editReply({ content: `${botConfig.CONFUSED} | <@${interaction.user.id}>, Você já adquiriu tudo o que há na loja!` });

        let active = 0;

        let prev = createNormalButton("<", "0", true);
        let buy = createSuccessButton(`${notOnInventory(store[active]) ? store[active]?.price?.toLocaleString("pt-BR") : "Comprado"}`, "1", (store[active].price > Number(user.coins)) || user?.inventory?.indexOf(store[active]._id) != -1);
        let next = createNormalButton(">", "2");

        const checkButtons = () => checkDisable(prev, buy, next, active < 1, (store[active].price > Number(user.coins)) || user?.inventory?.indexOf(store[active]._id) != -1, active >= store.length - 1);
        const getText = () => `Exibindo ${active + 1} de ${store.length}. Sua loja reseta em <t:${resetTime}:R>`;
        const getImage = async () => await getBadgeView(store[active]);
        const setPrice = () => buy.setLabel(`${store[active]?.price?.toLocaleString("pt-BR") ?? "Comprar"}`);




        const prevPage = async (confirmation: ButtonInteraction<CacheType>) => {
            active -= 1;
            checkButtons();
            //store = store.filter(notOnInventory);
            setPrice();
            if (!notOnInventory(store[active])) buy.setLabel("Comprado");
            await confirmation.update({ components: [row], content: `Carregando...` });
            let image = await getImage();
            await interaction.editReply({ content: getText(), components: [row], files: [image] });
        }

        const nextPage = async (confirmation: ButtonInteraction<CacheType>) => {
            active += 1;
            checkButtons();
            //store = store.filter(notOnInventory);
            setPrice();
            if (!notOnInventory(store[active])) buy.setLabel("Comprado");
            await confirmation.update({ components: [row], content: `Carregando...` });
            let image = await getImage();
            await interaction.editReply({ content: getText(), components: [row], files: [image] });
        }

        const buyItem = async (confirmation: ButtonInteraction<CacheType>) => {

            let bought = store[active].name;

            if (store[active].price < Number(user.coins)) {
                user = await UserController.addItems(String(user.userId), store[active]._id);
                user = await UserController.removeCash(user, {
                    from: user.userId,
                    to: `comprando o item ${store[active].name}`,
                    ammount: store[active].price
                });
                checkButtons();
                //store = store.filter(notOnInventory);
                active = active > store.length - 1 ? store.length - 1 : active;
                if (!notOnInventory(store[active])) buy.setLabel("Comprado");
                if (store.length == 0) {
                    return await interaction.editReply({ content: `${botConfig.BRIGHT} | <@${interaction.user.id}>, Você adquiriu toda a sua lojinha!`, components: [], files: [] });
                }

                setPrice();
                await confirmation.update({ components: [row], content: `Carregando...`, });
                let image = await getImage();
                await interaction.editReply({ content: getText(), files: [image] });
                await interaction.followUp({ ephemeral: true, content: `${botConfig.BRIGHT} | <@${interaction.user.id}>, Você adquiriu ${bought} com sucesso.` });

            }
        }


        let row = new ActionRowBuilder<ButtonBuilder>().addComponents(prev, buy, next);

        let image = await getImage();

        user.storeDate = new Date();
        user = await UserController.updateUser(String(user.userId), user);

        let response = await interaction.editReply({ content: getText(), components: [row], files: [image] });

        let collectorFilter = (i: ButtonInteraction<CacheType>) => i.user.id === interaction.user.id;
        let collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, filter: collectorFilter, time: 200000 });

        collector.on("collect", async (confirmation) => {

            if (confirmation.customId === "0") {
                await prevPage(confirmation);

            } else if (confirmation.customId === "2") {
                await nextPage(confirmation);

            } else {
                await buyItem(confirmation);

            }

        });

    }


    static async getStore(): Promise<IStore[]> {

        const todosOsItens: IStore[] = await DBStore.find({ restricted: false });


        const chances = {
            [Rarity.COMMON]: 0.9,
            [Rarity.RARE]: 0.09,
            [Rarity.MYTHIC]: 0.007,
            [Rarity.ULTRA_MYTHIC]: 0.003,
        };

        const itensAleatorios: IStore[] = [];
        const totalChances = Object.values(chances).reduce((acc, chance) => acc + chance, 0);


        for (let i = 0; i < 5; i++) {
            let randomChance = Math.random() * totalChances;
            let selectedRarity: Rarity | undefined;


            for (const [rarity, chance] of Object.entries(chances)) {
                randomChance -= chance;
                if (randomChance <= 0) {
                    selectedRarity = parseInt(rarity) as Rarity;
                    break;
                }
            }


            const availableItems = todosOsItens.filter(item => item.rarity === selectedRarity);

            if (availableItems.length > 0) {

                const randomIndex = Math.floor(Math.random() * availableItems.length);
                const selectedItem = availableItems[randomIndex];

                itensAleatorios.push(selectedItem);


                todosOsItens.splice(todosOsItens.indexOf(selectedItem), 1);
            }
        }

        return itensAleatorios;
    }

}