import { CacheType, CommandInteraction, Options, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import UserController from "../../database/controllers/UserController";
import { IUser, User } from "../../database/models/User";
import { botConfig } from "../../app";

export default abstract class BanList extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("banlist")
        .setDescription("Exibe os usuários banidos")

    static async execute(interaction: CommandInteraction<CacheType>) {

        if(!botConfig.admins.includes(interaction.user.id)) return await interaction.editReply({ content: "Você não tem permissão para usar este comando." });

        await interaction.deferReply({ ephemeral: true });
        let banned: IUser[] = await User.find({ banned: true });

        let bannedUsers = "";

        for(let ban of banned) bannedUsers += `* <@${ban.userId}> - ${ban?.banReason ? ban?.banReason : "Nenhum motivo registrado."}`;

        await interaction.editReply({ content: `Segue a lista de usuários banidos \n> ${bannedUsers}` });
    }
}