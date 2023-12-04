import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { botConfig } from "../../app";
import UserController from "../../database/controllers/UserController";

export default abstract class Inventory extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("inventory")
        .setDescription("Mostra seu inventário")

    
    static async execute(interaction: CommandInteraction<CacheType>) {

        await interaction.deferReply({ ephemeral: true });

        let user = await UserController.getUserById(interaction.user.id);

        await interaction.editReply({ content: `${botConfig.THINKING} | <@${interaction.user.id}>, no seu inventário tem: ${user?.inventory ?? "Nada"}` })

    }
}