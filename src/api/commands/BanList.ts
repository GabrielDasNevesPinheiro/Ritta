import { CacheType, CommandInteraction, Options, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import UserController from "../../database/controllers/UserController";
import { IUser, User } from "../../database/models/User";

export default abstract class BanList extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("banlist")
        .setDescription("Exibe os usuários banidos")

    static async execute(interaction: CommandInteraction<CacheType>) {

        if (interaction.user.id !== "274553417685270528") return;

        await interaction.deferReply({ ephemeral: true });
        let banned: IUser[] = await User.find({ banned: true });

        let bannedUsers = "";

        for(let ban of banned) bannedUsers += `* <@${ban.userId}> - ${ban?.banReason ? ban?.banReason : "Nenhum motivo registrado."}`;

        await interaction.editReply({ content: `Segue a lista de usuários banidos \n> ${bannedUsers}` });
    }
}