import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { botConfig } from "../../app";
import Command from "./Command";
import UserController from "../../database/controllers/UserController";

export default class EditUser extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("edituser")
        .addUserOption(option =>
            option.setName("user")
                .setRequired(true)
                .setDescription("Usuário a ser modificado")
        ).addStringOption(option =>
            option.setName("vip")
                .addChoices({ name: "Ativar", value: "true" }, { name: "Desativar", value: "false" })
                .setDescription("Ative ou desative o vip aqui")
        ).addStringOption(option =>
            option.setName("money")
                .setDescription(`Modifique a quantidade de pontos do usuário`)
        )
        .setDescription("Modifique os dados de algum usuário");


        static async execute(interaction: CommandInteraction<CacheType>) {

            await interaction.deferReply({ ephemeral: true });

            if(!(interaction.user.id === "274553417685270528")) return await interaction.editReply({ content: "Você não tem permissão para usar este comando." });

            const user = await UserController.getUserById(interaction.options.getUser("user").id);
            const cash = interaction.options.get("money")?.value;
            const vip = interaction.options.get("vip")?.value;

            console.log(user);

            if(!user) return await interaction.editReply({ content: "Não encontrei esse usuário." });

            if(cash) {
                try {
                    user.coins = cash as number;
                }   catch(error) {
                    return await interaction.editReply({ content: `Insira um valor numérico para definir os ${botConfig.cashname}.`});
                }
            }
            if(vip) user.vip = vip === "true" ? true :  false;

            const res = await UserController.updateUser(user.userId as string, user);
            
            let username = `<@${user.userId}>`;
            if(res) {
                return await interaction.editReply({ content: `${username} alterado com sucesso.`});
            }

        }
}