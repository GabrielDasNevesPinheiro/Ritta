import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { botConfig } from "../../app";

export default class Vote extends Command {
    
    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("vote")
        .setDescription("Vote em mim");

    static async execute(interaction: CommandInteraction) {
        await interaction.reply({ content: `${botConfig.CRYING} Eita! um ~~bug~~ processo de manutenção está ocorrendo, volte mais tarde.`})
    }

}