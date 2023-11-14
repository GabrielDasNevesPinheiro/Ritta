import { CacheType, Colors, CommandInteraction, Embed, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { botConfig } from "../../app";
import UserController from "../../database/controllers/UserController";
import { cooldownCheck, isVipExpired } from "../../util/DateUtils";
import TransactionController from "../../database/controllers/TransactionController";

export default class Crime extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("crime")
        .setDescription(`Impeça um crime e ganhe recompensas`);

    static async execute(interaction: CommandInteraction<CacheType>) {

        let min = 750;
        let max = 2000;
        let prob = 0.3;
        
        let user = await UserController.getUserById(interaction.user.id)
        let embed: EmbedBuilder = null;

        if (!user) {
            user = await UserController.createUser({ userId: interaction.user.id });
        }

        if(!isVipExpired(user).allowed) {
            min = 3500;
            max = 6000;
            prob = 0.9;
        }

        let cash = 0;
        if(Math.random() <= prob) { 
            cash = max;
        } else {
            cash = Math.floor(Math.random() * (max - min + 1) + min);
        }


        let crimeCheck = cooldownCheck(1, user.crimedate, false)

        if (!crimeCheck.allowed) {
            return await interaction.reply({ content: `**${botConfig.WAITING} |** <@${user.userId}>, volte em <t:${crimeCheck.time}> para prender outro criminoso novamente.`});
        }

            user.coins = user.coins as number + cash;
            user.crimedate = new Date();

            user = await UserController.updateUser(user.userId as string, user);

            if (user) {
                let transaction = await TransactionController.createTransaction({
                    to: user.userId as String,
                    from: "prendendo bandidos",
                    ammount: cash,
                });

                embed = new EmbedBuilder().setTitle(`${botConfig.GG} Crime Impedido`)
                    .setThumbnail(botConfig.IMG_GUN)
                    .setDescription(`> **Perfeito** <@${transaction.to}>, você conseguiu prender um criminoso sem ninguém se machucar e ganhou ${botConfig.getCashString(cash)} como recompensa, volte em **1 hora**.`)
                    .setColor(Colors.White).setTimestamp(Date.now())
                return await interaction.reply({ embeds: [embed] });
            }
        


    }

}