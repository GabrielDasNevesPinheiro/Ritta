import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { botConfig } from "../../app";

export default class Invite extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("invite")
        .setDescription("Me convide para seu servidor");

    static async execute(interaction: CommandInteraction) {

        let invite = "https://discord.gg/6myfy4MXXv";
        let link = "https://discord.com/api/oauth2/authorize?client_id=1173669387023167668&permissions=1514781599814&scope=bot";

        let invitebt = new ButtonBuilder()
            .setLabel(`Adicione`)
            .setEmoji(botConfig.GG)
            .setURL(link)
            .setStyle(ButtonStyle.Link)

        let linkbt = new ButtonBuilder()
            .setLabel(`👑 Servidor`)
            .setURL(invite)
            .setStyle(ButtonStyle.Link)

        let row = new ActionRowBuilder<ButtonBuilder>().addComponents(invitebt, linkbt);

        await interaction.reply({ content: `<@${interaction.user.id}>, Clique nos botões para ser redirecionado.`, components: [row] });
    }

}