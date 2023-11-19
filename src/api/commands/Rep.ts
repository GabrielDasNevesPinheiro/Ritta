import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import UserController from "../../database/controllers/UserController";
import { cooldownCheck, dailyCooldownCheck, isVipExpired } from "../../util/DateUtils";
import { ITransaction } from "../../database/models/Transaction";
import TransactionController from "../../database/controllers/TransactionController";
import { botConfig } from "../../app";

export default class Rep extends Command {
    
    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("rep")
        .addUserOption(option =>
            option.setName("user")
                .setRequired(true)
                .setDescription("Escolha o usuário")
        ).addStringOption(option => 
            option.setName("text")
            .setRequired(true)
            .setMinLength(5).setMaxLength(25)
            .setDescription("Texto da reputação")    
        )
        .setDescription("Dê uma reputação pra alguém");

    static async execute(interaction: CommandInteraction<CacheType>) {

        await interaction.deferReply({});
        
        let targetUser = interaction.options.getUser("user");
        let text = interaction.options.get("text").value as string;

        let user = await UserController.getUserById(targetUser.id);
        let thisuser = await UserController.getUserById(interaction.user.id);

        if(!thisuser) return await interaction.editReply({ content: `${botConfig.CONFUSED} | <@${interaction.user.id}>, Tente realizar suas tarefas primeiro.` });
        if(!user) return await interaction.editReply({ content: `${botConfig.CONFUSED} | <@${interaction.user.id}>, Você não pode enviar reputação para <@${targetUser.id}>.` });

        if(targetUser.id === interaction.user.id) return await interaction.editReply({ content: `${botConfig.CONFUSED} | <@${interaction.user.id}>, Você não pode se dar reputações.`});

        let repCheck = dailyCooldownCheck(24, thisuser.repDate, false);
        
        if (repCheck.allowed) {

            let res = await UserController.giveRep(thisuser, user, text);

            if(res) {
                await interaction.editReply({ content: `**${botConfig.OK} | Ótimo** <@${res.to}>, Você ganhou uma reputação de <@${interaction.user.id}>.`})
            } else {
                await interaction.editReply({ content: "ocorreu um erro, tente novamente" });
            }

        } else {
            await interaction.editReply({ content: `**${botConfig.WAITING} | <@${thisuser.userId}>**, Volte em <t:${repCheck.time}:R> para poder dar outra reputação.` });
        }

    }

}