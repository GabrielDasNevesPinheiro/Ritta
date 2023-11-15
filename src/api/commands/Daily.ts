import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import UserController from "../../database/controllers/UserController";
import { cooldownCheck, isVipExpired } from "../../util/DateUtils";
import { ITransaction } from "../../database/models/Transaction";
import TransactionController from "../../database/controllers/TransactionController";
import { botConfig } from "../../app";

export default class Daily extends Command {
    
    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("daily")
        .setDescription("Reivindique sua recompensa diária");

    static async execute(interaction: CommandInteraction<CacheType>) {
        
        let min = 1000;
        let max = 2500;
        let prob = 0.3;

        let user = await UserController.getUserById(interaction.user.id);

        if(!user) {
            user = await UserController.createUser({
                userId: interaction.user.id,
            });
        }

        if(!isVipExpired(user).allowed) {
            min = 8000;
            max = 13000;
            prob = botConfig.vipBetChances;
        }

        let cash = 0;
        if(Math.random() <= prob) { 
            cash = max;
        } else {
            cash = Math.floor(Math.random() * (max - min + 1) + min);
        }


        let dailyCheck = cooldownCheck(24, user.dailydate, true);
        
        if (dailyCheck.allowed) {

            user.coins = user.coins as number + cash;
            let trans: ITransaction = {
                to: user.userId as String,
                from: "na recompensa diária",
                ammount: cash
            };

            let transaction = await TransactionController.createTransaction(trans);
            user.dailydate = new Date();
            let res = UserController.updateUser(user.userId as string, user);

            if(transaction && res) {
                await interaction.reply({ content: `**Ótimo** <@${trans.to}>, você ganhou ${botConfig.getCashString(cash)} na **recompensa diária**, volte amanhã.`})
            } else {
                await interaction.reply({ content: "ocorreu um erro, tente novamente" });
            }

        } else {
            await interaction.reply({ content: `**${botConfig.WAITING} | <@${user.userId}>**, volte em <t:${dailyCheck.time}> para coletar sua recompensa novamente.`});
        }

    }

}