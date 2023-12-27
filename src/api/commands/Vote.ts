import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { botConfig } from "../../app";

export default class Vote extends Command {
    
    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("vote")
        .setDescription("Vote em mim");

    static async execute(interaction: CommandInteraction) {

        let button = new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("Votar")
        .setURL("https://top.gg/bot/1173669387023167668");
        let mention = await botConfig.mention(interaction.user.id);
        let row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

        await interaction.reply({ content: `${botConfig.BRIGHT} | ${mention}, Vote em mim e ganhe ${botConfig.getCashString(25000)}.`, components: [row]})
    }

}