import { Colors, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import UserController from "../../database/controllers/UserController";
import { botConfig } from "../../app";
import { cooldownCheck } from "../../util/DateUtils";

export default class Tasks extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("tasks")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Usuário desejado")
        )
        .setDescription("Exibe suas tarefas");

    static async execute(interaction: CommandInteraction) {

        let userId = interaction.options.getUser("user")?.id || interaction.user.id;
        let user = await UserController.getUserById(userId);

        if (!user) return await interaction.reply({ content: `${botConfig.CONFUSED} Não encontrei dados desse usuário.` });

        let dailyPlayed = !cooldownCheck(24, user.dailydate, true).allowed;
        let weeklyPlayed = !cooldownCheck(168, user.weeklydate).allowed;
        let workPlayed = !cooldownCheck(2, user.workdate).allowed;
        let crimePlayed = !cooldownCheck(1, user.crimedate).allowed;
        let tasksPlayed = user.tasksClaimed;

        let dailyString = dailyPlayed ? `:white_check_mark: 🎁 Você resgatou a recompensa diária!` : `:black_large_square: 🎁 Você não resgatou a recompensa diária!`;
        let workString = workPlayed ? `:white_check_mark: 💼 Você trabalhou!` : `:black_large_square: 💼 Você não trabalhou!`;
        let crimeString = crimePlayed ? `:white_check_mark: 💰 Você impediu um crime!` : `:black_large_square: 💰 Você não impediu um crime!`;
        let weeklyString = weeklyPlayed ? `:white_check_mark: 💸 Você coletou o semanal!` : `:black_large_square: 💸 Você não coletou o semanal!`;
        let tasksString = tasksPlayed ? `:white_check_mark: 🎉 Você reivindicou sua recompensa das tarefas` : `:black_large_square: 🎉 Colete suas recompensas com o comando __/claim__`;


        let embed = new EmbedBuilder()
            .setTitle(`Tarefas de ${interaction.client.users.cache.get(userId).username}`)
            .setDescription("Após completar suas tarefas, use o comando `/claim` para receber as recompensas.")
            .setThumbnail(`${botConfig.IMG_NOTED}`)
            .addFields([
                { name: ":one: Daily", value: dailyString },
                { name: ":two: Work", value: workString },
                { name: ":three: Crime", value: crimeString },
                { name: ":four: Semanal", value: weeklyString },
                { name: "Resgate das Recompensas", value: tasksString },
            ]).setColor(Colors.White).setTimestamp(new Date());

            await interaction.reply({ embeds: [embed] });
    }

}