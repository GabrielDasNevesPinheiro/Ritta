import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CacheType, Colors, CommandInteraction, ComponentType, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { checkBetValues, checkMaxValues } from "../../util/InteractionUtils";
import UserController from "../../database/controllers/UserController";
import { botConfig } from "../../app";
import { getMinutesCooldownFromNow, sortCooldownCheck } from "../../util/DateUtils";
import { IUser } from "../../database/models/User";

export default abstract class Drop extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("drop")
        .addIntegerOption(option =>
            option.setName("ammount")
                .setDescription("Quantia que você irá patrocinar")
                .setMinValue(1500)
                .setRequired(true)
        )
        .setDescription("Patrocine um drop no chat");

    static async execute(interaction: CommandInteraction<CacheType>) {

        interaction.deferReply({});

        let ammount = interaction.options.get("ammount").value as number;
        let res = await checkBetValues(String(ammount), interaction);

        let user = await UserController.getUserById(interaction.user.id);
        let canBet = await checkMaxValues(interaction, user, ammount);

        if (!res) return;
        if (!canBet) return;

        let embed = new EmbedBuilder()
            .setTitle(`🎉 Drop Lançado`)
            .setThumbnail(botConfig.IMG_RAINMONEY)
            .setDescription(`Lançado por: <@${user.userId}>.`)
            .addFields(
                { name: "Valor para o Vencedor", value: `${botConfig.getCashString(ammount)}`, inline: true },
                { name: `${botConfig.WAITING} Duração`, value: `<t:${getMinutesCooldownFromNow(1)}:R>`, inline: true },
                { name: `✨ Para participar`, value: `Clique no botão __PARTICIPAR__` },
                { name: `😘 Ganhador`, value: `Ninguém, ainda.` }
            ).setColor(Colors.White);

        let players: string[] = [];
        let acceptButton = new ButtonBuilder()
            .setLabel("PARTICIPAR (0)")
            .setCustomId("join")
            .setStyle(ButtonStyle.Primary)

        let row = new ActionRowBuilder<ButtonBuilder>().addComponents(acceptButton);

        let response = await interaction.editReply({ embeds: [embed], components: [row] });

        const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

        collector.on('collect', async (confirmation) => {

            if (confirmation.customId === "join") {
                if (confirmation.user.id === interaction.user.id) return;
                if (!(players.indexOf(confirmation.user.id) == -1)) return;
                players.push(confirmation.user.id);
                acceptButton.setLabel(`PARTICIPAR (${players.length})`);

                await confirmation.update({ embeds: [embed], components: [row] });
            }

        });

        collector.on("end", async (confirmation) => {
            let sortedUserId = players[Math.floor(Math.random() * (players.length - 1))];

            if (!sortedUserId) {
                await interaction.followUp({ content: `**${botConfig.FACEPALM} | <@${interaction.user.id}>,** Ninguém estava participando no drop, você recebeu a quantia de volta.`, components: [] })
                return;
            }

            let winner = await UserController.getUserById(sortedUserId);
            if (!winner) winner = await UserController.createUser({ userId: sortedUserId });

            winner = await UserController.addCash(winner, {
                from: "Lançado no drop",
                to: winner.userId,
                ammount
            });

            user = await UserController.removeCash(user, {
                from: user.userId,
                to: "patrocinando um drop",
                ammount
            });

            embed = new EmbedBuilder()
                .setTitle(`🎉 Drop Lançado`)
                .setDescription(`Lançado por: <@${user.userId}>.`)
                .setThumbnail(botConfig.IMG_RAINMONEY)
                .addFields(
                    { name: "Valor para o Vencedor", value: `${botConfig.getCashString(ammount)}`, inline: true },
                    { name: `${botConfig.WAITING} Duração`, value: "`Drop encerrado.`", inline: true },
                    { name: `✨ Para participar`, value: `Clique no botão __PARTICIPAR__` },
                    { name: `😘 Ganhador`, value: `<@${winner.userId}>` }
                ).setColor(Colors.White);

            await interaction.editReply({ embeds: [embed], components: [] });
            await interaction.followUp({ content: `**${botConfig.STONKS} | Parabéns <@${sortedUserId}>**, Você ganhou ${botConfig.getCashString(ammount)} no drop Lançado por <@${interaction.user.id}>.` });

        });

    }
}