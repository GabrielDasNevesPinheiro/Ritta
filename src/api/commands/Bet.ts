import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, CommandInteraction, ComponentType, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import UserController from "../../database/controllers/UserController";
import { botConfig } from "../../app";
import { checkPayValues, getIntegerOption } from "../../util/InteractionUtils";
import { isVipExpired } from "../../util/DateUtils";
import { IUser } from "../../database/models/User";

export default class Bet extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("bet")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Usuário para a posta")
                .setRequired(true)
        ).addStringOption(option =>
            option.setName("ammount")
                .setDescription("Quantidade desejada para a aposta")
                .setRequired(true)
        )
        .setDescription("Desafie alguém numa aposta");

    static async execute(interaction: CommandInteraction) {

        await interaction.deferReply();
        let targetUserId = interaction.options.getUser("user").id;
        let ammount: number = getIntegerOption(interaction.options.get("ammount")?.value as string);

        let res = await checkPayValues(targetUserId, String(ammount), interaction );

        if(!res) return;

        let user = await UserController.getUserById(interaction.user.id);
        let targetUser = await UserController.getUserById(targetUserId);


        let emojis = [":monkey_face:", ":cat:", ":dog:"];
        let face = emojis[Math.floor(Math.random() * emojis.length)];
        emojis = emojis.filter((item) => item !== face);

        let crown = emojis[Math.floor(Math.random() * emojis.length)];
        emojis = emojis.filter((item) => item !== crown);

        let confirm = new ButtonBuilder()
            .setCustomId("agree")
            .setLabel("Aceitar (0/2)")
            .setStyle(ButtonStyle.Success)

        let row = new ActionRowBuilder<ButtonBuilder>().addComponents(confirm);

        let response = await interaction.editReply({
            content: `**<@${targetUserId}>${crown}, <@${user.userId}>${face}** deseja fazer uma aposta com você no valor de ${botConfig.getCashString(ammount)}.\nPara aceitar a aposta, os dois devem clicar no **botão abaixo**.\n` +
                `Se ${face} vencer <@${user.userId}> ganha ${botConfig.getCashString(ammount)}.\n` +
                `Se ${crown} vencer <@${targetUserId}> ganha ${botConfig.getCashString(ammount)}.`, embeds: [], components: [row]
        });
        let confirmed: IUser[] = [];

        const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

        collector.on("collect", async (confirmation) => {

            if (confirmation.customId === "agree") {

                if (confirmation.user.id === user.userId) {
                    confirmed.push(user);
                    confirm = confirm.setLabel(`Aceitar (${confirmed.length}/2)`);
                    await confirmation.update({ components: [row] });
                }
                if (confirmation.user.id === targetUser.userId) {
                    confirmed.push(targetUser);
                    confirm = confirm.setLabel(`Aceitar (${confirmed.length}/2)`);
                    await confirmation.update({ components: [row] });
                }

                if (confirmed.length == 2) {
                    let toSort = [face, crown];
                    let userProb = botConfig.normalBetChances;
                    let otherProb = botConfig.normalBetChances;
                    let tax = 10 ** (ammount.toLocaleString("pt-BR").split(".")[1]?.length - 1 || 1);
                    let otherTax = 10 ** (ammount.toLocaleString("pt-BR").split(".")[1]?.length - 1 || 1);

                    if (!isVipExpired(user).allowed) {
                        userProb = botConfig.vipBetChances;
                        tax = 0;
                    }
                    if (!isVipExpired(targetUser).allowed) {
                        otherProb = botConfig.vipBetChances;
                        otherTax = 0;
                    }


                    if (!isVipExpired(user).allowed && !isVipExpired(targetUser).allowed) {
                        userProb = botConfig.normalBetChances;
                        otherProb = botConfig.normalBetChances;
                        tax = 0;
                        otherTax = 0;
                    }

                    let sorted = Math.random();
                    let winner: IUser = null;
                    let loser: IUser = null;
                    let selectedTax = 0;
                    let sortedText = "";
                    let winnerEmoji = "";
                    let loserEmoji = ""

                    if (sorted <= userProb) {
                        winner = user
                        loser = targetUser;
                        selectedTax = tax;
                        sortedText = "**CARA!**"
                        winnerEmoji = face;
                        loserEmoji = crown;

                    } else if (sorted >= userProb || sorted <= userProb) {
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
                            (selectedTax > 0 ? '`' + `(${selectedTax} de taxa) ` + '`' : ``) + ` patrocinadas por <@${loser.userId}>${loserEmoji}.`, components: []
                    })
                    return;

                }
            }
        });
    }

}