import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, Colors, CommandInteraction, ComponentType, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import UserController from "../../database/controllers/UserController";
import { botConfig } from "../../app";
import { checkMaxValues, checkPayValues, getIntegerOption, getTax } from "../../util/InteractionUtils";
import { isVipExpired } from "../../util/DateUtils";
import { IUser } from "../../database/models/User";

export default class Bet extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("coinflip")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Usuário para a posta")
                .setRequired(true)
        ).addIntegerOption(option =>
            option.setName("ammount")
                .setDescription("Quantidade desejada para a aposta")
                .setRequired(true)
                .setMinValue(100)
        )
        .setDescription("Desafie alguém numa aposta");

    static async execute(interaction: CommandInteraction) {

        await interaction.deferReply();
        let targetUserId = interaction.options.getUser("user").id;
        let ammount: number = interaction.options.get("ammount").value as number;

        let res = await checkPayValues(targetUserId, String(ammount), interaction);

        if (!res) return;

        let user = await UserController.getUserById(interaction.user.id);
        let targetUser = await UserController.getUserById(targetUserId);

        if (Number(targetUser.coins) < ammount) {
            return await interaction.editReply({ content: `${botConfig.CRYING} | <@${targetUser.userId}> não tem a quantia necessária para esta aposta.` })
        }


        let emojis = botConfig.emojis;

        let face = user?.pet as string ?? emojis[0];

        let crown = targetUser?.pet as string ?? emojis[1];

        let confirm = new ButtonBuilder()
            .setCustomId("agree")
            .setLabel("Aceitar")
            .setStyle(ButtonStyle.Success)

        let row = new ActionRowBuilder<ButtonBuilder>().addComponents(confirm);

        let response = await interaction.editReply({
            content: `**<@${user.userId}>${face}** está desafiando ${crown}<@${targetUserId}> para uma aposta\n${botConfig.BRIGHT} Cada um apostará ${botConfig.getCashString(ammount)} e o vencedor leva tudo!(${botConfig.getCashString(getTax(ammount))} de taxa).\nPara continuar, <@${targetUser.userId}> deve confirmar abaixo!.\n`,
                embeds: [], components: [row]
        });
        let confirmed: IUser[] = [];

        const collectorFilter = (i: ButtonInteraction) => i.user.id === targetUser.userId;
        const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 300000, filter: collectorFilter });

        collector.on("collect", async (confirmation) => {


            let tax = getTax(ammount);
            let otherTax = getTax(ammount);

            if (!isVipExpired(user).allowed) {
                tax = 0;
            }
            if (!isVipExpired(targetUser).allowed) {
                otherTax = 0;
            }

            let sorted = Math.random();
            let winner: IUser = null;
            let loser: IUser = null;
            let selectedTax = 0;
            let sortedText = "";
            let winnerEmoji = "";
            let loserEmoji = ""

            if (sorted < 0.5) {
                winner = user
                loser = targetUser;
                selectedTax = tax;
                sortedText = "**CARA!**"
                winnerEmoji = face;
                loserEmoji =  crown;

            } else if (sorted >= 0.5) {
                winner = targetUser;
                loser = user;
                selectedTax = otherTax;
                sortedText = "**COROA!**";
                winnerEmoji = crown;
                loserEmoji = face;
            }

            let calcAmmount = ammount - selectedTax;
            await UserController.addCash(winner, {
                from: `na aposta com ${interaction.client.users.cache.get(String(loser.userId)).username}`,
                to: winner.userId,
                ammount: calcAmmount
            });

            await UserController.removeCash(loser, {
                from: loser.userId,
                to: `na aposta com ${interaction.client.users.cache.get(String(winner.userId)).username}`,
                ammount
            });

            await interaction.editReply({
                content: `${sortedText}\n <@${winner.userId}>${winnerEmoji} venceu! Com isso recebeu ${botConfig.getCashString(calcAmmount)}` +
                    (selectedTax > 0 ? '`' + `(${selectedTax} de taxa)` + '`' : ``) + ` patrocinadas por <@${loser.userId}>${loserEmoji}.`, components: []
            })
            return;

        });

    }

}