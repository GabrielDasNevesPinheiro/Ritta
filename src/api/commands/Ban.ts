import { CacheType, CommandInteraction, Options, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import UserController from "../../database/controllers/UserController";

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
        )
        .setDescription("Bane ou desbane um usuário")

    static async execute(interaction: CommandInteraction<CacheType>) {

        if (interaction.user.id !== "274553417685270528") return;

        await interaction.deferReply();
        let userId = interaction.options.getUser("user").id;
        let operation = interaction.options.get("operation").value as number;
        let user = await UserController.getUserById(userId);

        if (!user) user = await UserController.createUser({ userId });

        user.banned = operation == 0 ? true : false;
        user = await UserController.updateUser(userId, user);

        await interaction.editReply({ content: `O usuário <@${userId}> foi ${user.banned ? "banido" : "desbanido"} com sucesso.` });
    }
}