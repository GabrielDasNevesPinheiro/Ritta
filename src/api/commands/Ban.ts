import { CacheType, CommandInteraction, Options, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import UserController from "../../database/controllers/UserController";
import { botConfig } from "../../app";

export default abstract class Ban extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("ban")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Selecione um usuário")
                .setRequired(true)
        ).addIntegerOption(option =>
            option.setName("operation")
                .setDescription("Operação a ser realizada")
                .addChoices({ name: "Banir", value: 0 }, { name: "Desbanir", value: 1 })
                .setRequired(true)
        ).addStringOption(option => 
                option.setName("reason")
                .setDescription("Motivo do ban")
            )
        .setDescription("Bane ou desbane um usuário")

    static async execute(interaction: CommandInteraction<CacheType>) {

        if(!botConfig.admins.includes(interaction.user.id)) return await interaction.editReply({ content: "Você não tem permissão para usar este comando." });

        await interaction.deferReply();
        let userId = interaction.options.getUser("user").id;
        let operation = interaction.options.get("operation").value as number;
        let reason = interaction.options.get("reason").value as string;
        let user = await UserController.getUserById(userId);

        if (!user) user = await UserController.createUser({ userId });

        user.banned = operation == 0 ? true : false;
        user.banReason = reason;
        user = await UserController.updateUser(userId, user);
        
        await interaction.editReply({ content: `O usuário <@${userId}> foi ${user.banned ? "banido" : "desbanido"} com sucesso.` });
    }
}