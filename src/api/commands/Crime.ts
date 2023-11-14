import { CacheType, Colors, CommandInteraction, Embed, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { cashname } from "../../app";
import UserController from "../../database/controllers/UserController";
import { cooldownCheck } from "../../util/DateUtils";
import TransactionController from "../../database/controllers/TransactionController";

export default class Crime extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("crime")
        .setDescription(`Impeça um crime e ganhe recompensas`);

    static async execute(interaction: CommandInteraction<CacheType>) {

        let cash = Math.floor(Math.random() * (500 - 170 + 1) + 170);
        let user = await UserController.getUserById(interaction.user.id)
        let embed: EmbedBuilder = null;

        if (!user) {
            user = await UserController.createUser({ userId: interaction.user.id });
        }

        let crimeCheck = cooldownCheck(1, user.crimedate, false)

        if (!crimeCheck.allowed) {
            return await interaction.reply({ content: `**⏰ |** <@${user.userId}>, volte em <t:${crimeCheck.time}> para prender outro criminoso novamente`});
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

                embed = new EmbedBuilder().setTitle("<:stonks:1173773269913063545> Crime Impedido")
                    .setDescription(`> **Perfeito** <@${transaction.to}>, você conseguiu prender um criminoso sem ninguém se machucar e ganhou **${transaction.ammount.toLocaleString("pt-BR")} ${cashname}** como recompensa, volte em **1 hora**`)
                    .setColor(Colors.White)
                return await interaction.reply({ embeds: [embed] });
            }
        


    }

}