import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { botConfig } from "../../app";

export default class Vote extends Command {
    
    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("vote")
        .setDescription("Vote em mim");

    static async execute(interaction: CommandInteraction) {
        await interaction.reply({ content: `${botConfig.BRIGHT} | <@${interaction.user.id}>, Vote em mim no [Top.gg](https://top.gg/bot/1173669387023167668) e ganhe ${botConfig.getCashString(25000)}.`})
    }

}