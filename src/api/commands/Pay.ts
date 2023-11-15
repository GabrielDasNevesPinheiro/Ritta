import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import UserController from "../../database/controllers/UserController";
import { botConfig } from "../../app";

export default class Pay extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("pay")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Usuário que receberá o pagamento")
                .setRequired(true)
        )
        .setDescription("Efetue um pagamento à alguém");

    static async execute(interaction: CommandInteraction) {
        
        await interaction.deferReply();

        let targetUserId = interaction.options.getUser("user").id;

        let targetUser = await UserController.getUserById(targetUserId);

        if(!targetUser) return await interaction.editReply({ content: `**${botConfig.CONFUSED} |<@${interaction.user.id}>, Não encontrei <@${targetUserId}> em meus registros.**`});
        
    }

}