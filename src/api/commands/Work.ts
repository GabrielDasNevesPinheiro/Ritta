import { CacheType, Colors, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { cashname } from "../../app";
import UserController from "../../database/controllers/UserController";
import { cooldownCheck } from "../../util/DateUtils";
import TransactionController from "../../database/controllers/TransactionController";

export default class Work extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("work")
        .setDescription(`Trabalhe para ganhar recompensas`);

    static async execute(interaction: CommandInteraction<CacheType>) {

        let cash = Math.floor(Math.random() * (500 - 170 + 1) + 170);
        let user = await UserController.getUserById(interaction.user.id)
        let embed: EmbedBuilder = null;

        if (!user) {
            user = await UserController.createUser({ userId: interaction.user.id });
        }

        let crimeCheck = cooldownCheck(1, user.workdate, false);

        if (!crimeCheck.allowed) {
            return await interaction.reply({ content: `**⏰ |** <@${user.userId}>, volte em <t:${crimeCheck.time}> para prender outro criminoso novamente` });
        }

        user.coins = user.coins as number + cash;
        user.workdate = new Date();

        user = await UserController.updateUser(user.userId as string, user);

        if (user) {
            let transaction = await TransactionController.createTransaction({
                to: user.userId as String,
                from: "prendendo bandidos",
                ammount: cash,
            });

            embed = new EmbedBuilder().setTitle("<:stonks:1173773269913063545> Crime Impedido")
                .setDescription(`> **Perfeito** <@${transaction.to}>, você conseguiu prender um criminoso sem ninguém se machucar e ganhou **${transaction.ammount} ${cashname}** como recompensa, volte em <t:10000000>`)
                .setColor(Colors.Yellow)
            return await interaction.reply({ embeds: [embed] });
        }

    }
}


