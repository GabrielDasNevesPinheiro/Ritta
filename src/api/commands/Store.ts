import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, CacheType, CommandInteraction, ComponentType, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction, StringSelectMenuOptionBuilder } from "discord.js";
import { Store as DBStore, IStore, ItemType } from "../../database/models/Store";
import Command from "./Command";
import { checkDisable, createNormalButton, createPagination, createSuccessButton, updateConfirmation } from "../../util/InteractionUtils";
import { getBadgeView } from "../../util/ImageUtils";


export default abstract class Store extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("store")
        .setDescription("Sua loja diária")


    static async execute(interaction: CommandInteraction<CacheType>) {
        
        await interaction.deferReply({});
        await Store.storeView(interaction);

    }

    static async storeView(interaction: CommandInteraction) {
        let store: IStore[] = (await DBStore.find({ restricted: false }).sort({ price: 'asc'}));

        let active = 0;

        let prev = createNormalButton("<", "0", true);
        let buy = createSuccessButton(`${store[active]?.price ?? "Comprar"}`, "1");
        let next = createNormalButton(">", "2");

        const checkButtons = () => checkDisable(prev, buy, next, active < 1, false, active >= store.length - 1);
        const getText = () => `Exibindo ${active + 1} de ${store.length - 1}.`;
        const getImage = async () => await getBadgeView(store[active]);
        const setPrice = () => buy.setLabel(`${store[active]?.price?.toLocaleString("pt-BR") ?? "Comprar"}`);
        setPrice();



        const prevPage = async (confirmation: ButtonInteraction<CacheType>) => {
            active -= 1;
            checkButtons();
            setPrice();
            let image = await getImage();
            await interaction.editReply({ content: getText(), components: [row], files: [image] });
            await confirmation.update({});
        }

        const nextPage = async (confirmation: ButtonInteraction<CacheType>) => {
            active += 1;
            checkButtons();
            setPrice();
            let image = await getImage();
            await interaction.editReply({ content: getText(), components: [row], files: [image] });
            await confirmation.update({});
        }


        let row = new ActionRowBuilder<ButtonBuilder>().addComponents(prev, buy, next);

        let image = await getImage();
        let response = await interaction.editReply({ content: getText(), components: [row], files: [image] });

        await createPagination(response, row, prevPage, (i) => { }, nextPage);
    }


}