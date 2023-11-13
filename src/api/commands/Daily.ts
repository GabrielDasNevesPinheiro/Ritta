import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import UserController from "../../database/controllers/UserController";
import { cooldownCheck } from "../../util/DateUtils";
import { ITransaction, transactionSchema } from "../../database/models/Transaction";
import TransactionController from "../../database/controllers/TransactionController";
import { Schema } from "mongoose";
import { cashname } from "../../app";

export default class Daily extends Command {
    
    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("daily")
        .setDescription("Reivindique sua recompensa diária");

    static async execute(interaction: CommandInteraction<CacheType>) {
        
        let cash = 0;
        if(Math.random() <= 0.01) { 
            cash = 2000;
        } else {
            cash = Math.floor(Math.random() * (3000 - 950 + 1) + 950);
        }

        let user = await UserController.getUserById(interaction.user.id);

        if(!user) {
            user = await UserController.createUser({
                userId: interaction.user.id,
            });
        }

        let dailyCheck = cooldownCheck(user, 24, true);
        
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
                await interaction.reply({ content: `**Ótimo** <@${trans.to}>, você ganhou <:biscoito:1173719565335810198> **${cash.toLocaleString()} ${cashname}** na **recompensa diária**, volte amanhã`})
            } else {
                await interaction.reply({ content: "ocorreu um erro, tente novamente" });
            }

        } else {
            await interaction.reply({ content: `**⏰ | <@${user.userId}>**, volte em <t:${dailyCheck.time}> para coletar sua recompensa novamente.`});
        }

    }

}