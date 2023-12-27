import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { botConfig } from "../../app";

export default class Invite extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("invite")
        .setDescription("Me convide para seu servidor");

    static async execute(interaction: CommandInteraction) {

        let invite = "https://discord.com/invite/48zfhnJ954";
        let link = "https://discord.com/api/oauth2/authorize?client_id=1173669387023167668&permissions=1514781599814&scope=bot";

        let invitebt = new ButtonBuilder()
            .setLabel(`Me Adicione`)
            .setURL(link)
            .setStyle(ButtonStyle.Link)

        let linkbt = new ButtonBuilder()
            .setLabel(`👑 Meu Servidor`)
            .setURL(invite)
            .setStyle(ButtonStyle.Link)

        let row = new ActionRowBuilder<ButtonBuilder>().addComponents(invitebt, linkbt);
        let mention = await botConfig.mention(interaction.user.id);

        await interaction.reply({ content: `${mention}, Clique nos botões para ser redirecionado.`, components: [row] });
    }

}