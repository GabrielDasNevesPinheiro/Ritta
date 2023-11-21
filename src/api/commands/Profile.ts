import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { getProfile } from "../../util/ImageUtils";
import UserController from "../../database/controllers/UserController";
import { botConfig } from "../../app";


export default abstract class Profile extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("profile")
        .addUserOption(option => 
            option.setName("user")
            .setDescription("Usuário a ser selecionado")
            )
            .setDescription("Exibe o perfil de alguém")
    
    static async execute(interaction: CommandInteraction<CacheType>) {
        await interaction.deferReply({});

        let user = interaction.options.getUser("user") || interaction.user;

        if(user.id === "274553417685270528" && interaction.user.id !== "274553417685270528") return;

        let dbUser = await UserController.getUserById(user.id);

        if(!dbUser) await interaction.editReply({ content: `${botConfig.CONFUSED} | <@${interaction.user.id}> Não encontrei este usuário em meus registros.` });

        let reps = await UserController.getReps(user.id);
        let partner: string = null;

        if(dbUser.partner) partner = (await interaction.client.users.fetch(String(dbUser.partner))).displayName ?? null;
        reps = reps.filter((rep) => rep.to === user.id);

        let result = await getProfile(dbUser, user, reps.length, partner);

        await interaction.editReply({ files: [result] });

    }
}