import { CacheType, Colors, CommandInteraction, EmbedBuilder, SlashCommandBuilder, BufferResolvable } from "discord.js";
import Command from "./Command";
import { botConfig } from "../../app";
import UserController from "../../database/controllers/UserController";
import { cooldownCheck, isVipExpired } from "../../util/DateUtils";
import TransactionController from "../../database/controllers/TransactionController";
import path from "path";

export default class Work extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("work")
        .setDescription(`Trabalhe para ganhar recompensas`);

    static async execute(interaction: CommandInteraction<CacheType>) {

        let min = 850;
        let max = 2100;
        let prob = 0.3;

        let user = await UserController.getUserById(interaction.user.id)
        let embed: EmbedBuilder = null;

        if (!user) {
            user = await UserController.createUser({ userId: interaction.user.id });
        }
        if(!isVipExpired(user).allowed) {
            min = 4500;
            max = 7000;
            prob = botConfig.vipBetChances;
        }

        let cash = 0;
        if(Math.random() <= prob) { 
            cash = max;
        } else {
            cash = Math.floor(Math.random() * (max - min + 1) + min);
        }

        let workCheck = cooldownCheck(2, user.workdate, false);

        if (!workCheck.allowed) {
            return await interaction.reply({ content: `**${botConfig.WAITING} |** <@${user.userId}>, volte em <t:${workCheck.time}> para trabalhar novamente.` });
        }

        user.coins = user.coins as number + cash;
        user.workdate = new Date();

        user = await UserController.updateUser(user.userId as string, user);

        if (user) {
            let transaction = await TransactionController.createTransaction({
                to: user.userId as String,
                from: "trabalhando",
                ammount: cash,
            });

            embed = new EmbedBuilder().setTitle(`${botConfig.GG} Trabalho Concluído`)
                .setDescription(`> **Ótimo** <@${transaction.to}>, completou seu trabalho com sucesso e ganhou ${botConfig.getCashString(cash)} como salário, volte em **2 horas**.`)
                .setColor(Colors.Blue).setTimestamp(Date.now());
            return await interaction.reply({ embeds: [embed] });
        }

    }
}


