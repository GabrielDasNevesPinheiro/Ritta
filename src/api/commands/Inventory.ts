import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, CacheType, CommandInteraction, ComponentType, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { botConfig } from "../../app";
import UserController from "../../database/controllers/UserController";
import { IStore, ItemType, Store } from "../../database/models/Store";
import { createNormalButton, createSuccessButton } from "../../util/InteractionUtils";

export default abstract class Inventory extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("inventory")
        .setDescription("Mostra seu inventário")


    static async execute(interaction: CommandInteraction<CacheType>) {

        await interaction.deferReply({ ephemeral: true });

        let types = {
            0: "Fundo",
            1: "Insígnia",
            2: "Pet"
        }

        let user = await UserController.getUserById(interaction.user.id);

        let embeds = await Promise.all(user?.inventory?.map(async (id) => {

            let item: IStore = await Store.findById(id);

            return new EmbedBuilder()
                .setTitle(`${types[item.itemType]} ${item.name}`)
                .setDescription(`> Adquirido por ${botConfig.getCashString(item.price)}`)
                .setImage(`${item.url}`).setTimestamp(new Date());

        }));
        let mention = await botConfig.mention(interaction.user.id);

        if(embeds.length == 0) return await interaction.editReply({ content: `${botConfig.CONFUSED} | ${mention}, Você não tem nada em seu inventário ainda.` });
        let active = 0;

        let prev = createNormalButton("<", "prev", true);
        let enable = createSuccessButton("Ativar", "enable", user?.activated?.indexOf(user?.inventory[active]) != -1 );
        let disable = createSuccessButton("Desativar", "disable", user?.activated?.indexOf(user?.inventory[active]) == -1 );
        let next = createNormalButton(">", "next");
        let row = new ActionRowBuilder<ButtonBuilder>().addComponents(prev, enable, disable, next);
        let getText = () => `Exibindo ${active + 1} de ${embeds.length}`;

        let res = await interaction.editReply({ content: getText(), embeds: [embeds[active]], components: [row] });

        let collectorFilter = (i: ButtonInteraction) => i.user.id === interaction.user.id;
        let collector = res.createMessageComponentCollector({ componentType: ComponentType.Button, filter: collectorFilter, time: 240000 });


        collector.on("collect", async(confirmation) => {

            if(confirmation.customId === "next") active += 1;
            if(confirmation.customId === "prev") active -= 1;
            

            if(confirmation.customId === "enable") {
                user = await UserController.enableItem(String(user.userId), user?.inventory[active]);
            };
            if(confirmation.customId === "disable") user = await UserController.disableItem(String(user.userId), user?.inventory[active]);

            prev.setDisabled(active < 1);
            enable.setDisabled(user?.activated?.indexOf(user?.inventory[active]) != -1);
            disable.setDisabled(user?.activated?.indexOf(user?.inventory[active]) == -1);
            next.setDisabled(active >= embeds.length - 1);

            await confirmation.update({ content: getText(), components: [row], embeds: [embeds[active]] });

        });

    }
}