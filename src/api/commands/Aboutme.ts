import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import UserController from "../../database/controllers/UserController";
import { botConfig } from "../../app";


export default abstract class Aboutme extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("aboutme")
        .addStringOption(option => 
            option.setName("text")
            .setDescription("O texto que será sua descrição")
            .setRequired(true)
            .setMinLength(5).setMaxLength(250)
            ).setDescription("Modifique o texto do seu perfil")

        static async execute(interaction: CommandInteraction<CacheType>) {
            await interaction.deferReply({ ephemeral: true });

            let user = await UserController.getUserById(interaction.user.id);

            if(!user) user = await UserController.createUser({ userId: interaction.user.id });

            user.about = interaction.options.get("text").value as string;

            await UserController.updateUser(String(user.userId), user);

            await interaction.editReply({ content: `${botConfig.OK} | <@${interaction.user.id}>, Sua descrição foi alterada com sucesso! ` });
        }
}