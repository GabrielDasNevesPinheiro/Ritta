import { Colors, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import UserController from "../../database/controllers/UserController";
import { botConfig } from "../../app";
import { claimCooldownCheck, cooldownCheck, dailyCooldownCheck } from "../../util/DateUtils";
import TransactionController from "../../database/controllers/TransactionController";

export default class Claim extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("claim")
        .setDescription("Colete sua recompensa por completar tarefas");

    static async execute(interaction: CommandInteraction) {

        let min = 2000;
        let max = 5000;
        let prob = 0.3;

        let user = await UserController.getUserById(interaction.user.id);

        if (!user) return await interaction.reply({ content: `${botConfig.CONFUSED} Tente fazer suas tarefas antes.` });

        let dailyPlayed = !dailyCooldownCheck(24, user.dailydate).allowed;
        let weeklyPlayed = !cooldownCheck(168, user.weeklydate).allowed;
        let workPlayed = !cooldownCheck(2, user.workdate).allowed;
        let crimePlayed = !cooldownCheck(1, user.crimedate).allowed;
        let tasksPlayed = !claimCooldownCheck(24, user.tasksDate).allowed;
        let tasksTime = cooldownCheck(24, user.tasksDate).time;

        if (tasksPlayed) {
            let mention = await botConfig.mention(interaction.user.id);
            return await interaction.reply({ content: `${botConfig.WAITING} | ${mention}, volte <t:${tasksTime}:R> para resgatar as recompensas das tarefas.` });
        }

        if (dailyPlayed && weeklyPlayed && workPlayed && crimePlayed) {

            let cash = 0;
            if (Math.random() <= prob) {
                cash = max;
            } else {
                cash = Math.floor(Math.random() * (max - min + 1) + min);
            }

            user.coins = user.coins as number + cash;
            user.tasksDate = new Date();

            let trans = TransactionController.createTransaction({
                from: "completando todas as tarefas",
                to: user.userId,
                ammount: cash
            });

            user = await UserController.updateUser(user.userId as string, user);

            let embed = new EmbedBuilder()
                .setTitle(`${botConfig.HI} Tarefas Concluídas!`)
                .setDescription(`> Você coletou ${botConfig.getCashString(cash)} como recompensa por ter completado as tarefas diárias. Volte em breve para fazer as tarefas novamente.`)
                .setTimestamp(Date.now()).setColor(Colors.Green)

            await interaction.reply({ embeds: [embed] });
        } else {
            await interaction.reply({ content: `${botConfig.IDK} Você precisa completar todas as suas tarefas antes.` });
        }
        

    }

}