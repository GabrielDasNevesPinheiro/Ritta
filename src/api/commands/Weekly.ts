import { CacheType, Colors, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import UserController from "../../database/controllers/UserController";
import { cooldownCheck } from "../../util/DateUtils";
import { ITransaction } from "../../database/models/Transaction";
import TransactionController from "../../database/controllers/TransactionController";
import { botConfig } from "../../app";

export default class Weekly extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("weekly")
        .setDescription("Reivindique sua recompensa semanal");

    static async execute(interaction: CommandInteraction<CacheType>) {

        let cash = Math.floor(Math.random() * (10000 - 5000 + 1) + 5000);

        let user = await UserController.getUserById(interaction.user.id);

        if (!user) {
            user = await UserController.createUser({
                userId: interaction.user.id,
            });
        }

        let weeklyCheck = cooldownCheck(168, user.weeklydate, true);

        if (weeklyCheck.allowed) {

            user.coins = user.coins as number + cash;
            let trans: ITransaction = {
                to: user.userId as String,
                from: "na recompensa semanal",
                ammount: cash
            };

            let transaction = await TransactionController.createTransaction(trans);
            user.weeklydate = new Date();
            let res = UserController.updateUser(user.userId as string, user);

            if (transaction && res) {
                weeklyCheck = cooldownCheck(168, user.weeklydate);

                let embed = new EmbedBuilder().setTitle("Semanal resgatado")
                    .setThumbnail(`${botConfig.IMG_STONKS}`)
                    .setDescription(`> **Espetacular** ein <@${transaction.to}>, você resgatou sua recompensa semanal e ganhou **${transaction.ammount.toLocaleString("pt-BR")} ${botConfig.cashname}** como recompensa`)
                    .setColor(Colors.Blue).addFields([
                        { name: "**Próxima Recompensa**", value: `<t:${weeklyCheck.time}>` }
                    ]).setTimestamp(Date.now())
                return await interaction.reply({ embeds: [embed] });

            } else {
                await interaction.reply({ content: "ocorreu um erro, tente novamente" });
            }

        } else {
            await interaction.reply({ content: `**⏰ | <@${user.userId}>**, volte em <t:${weeklyCheck.time}> para coletar sua recompensa novamente.` });
        }

    }
}