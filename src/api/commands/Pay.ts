import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, Colors, CommandInteraction, ComponentType, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import UserController from "../../database/controllers/UserController";
import { botConfig } from "../../app";
import { checkPayValues, getIntegerOption } from "../../util/InteractionUtils";
import { getMinutesCooldownFromNow, isVipExpired } from "../../util/DateUtils";
import { IUser } from "../../database/models/User";

export default class Pay extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("pay")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Usuário que receberá o pagamento")
                .setRequired(true)
        ).addIntegerOption(option =>
            option.setName("ammount")
                .setDescription("Quantidade desejada")
                .setRequired(true)
                .setMinValue(20)
        )
        .setDescription("Efetue um pagamento à alguém");

    static async execute(interaction: CommandInteraction) {

        await interaction.deferReply();
        let targetUserId = interaction.options.getUser("user").id;
        let ammount: number = interaction.options.get("ammount").value as number;

        let mention = await botConfig.mention(interaction.user.id);
        let targetmention = await botConfig.mention(interaction.user.id);
        

        let targetUser = await UserController.getUserById(targetUserId);
        let user = await UserController.getUserById(interaction.user.id);

        let res = await checkPayValues(targetUserId, String(ammount), interaction);

        if (!res) return;

        let confirm = new ButtonBuilder()
            .setCustomId("agree")
            .setLabel("Confirmar")
            .setStyle(ButtonStyle.Success)

        let row = new ActionRowBuilder<ButtonBuilder>().addComponents(confirm);

        let response = await interaction.editReply({
            content:
                `${botConfig.BRIGHT} Você está prestes a transferir ${botConfig.getCashString(ammount)}, para ${targetmention}.\nPara concluir o pagamento, o destinatário deve confirmar até em até <t:${getMinutesCooldownFromNow(5)}>(<t:${getMinutesCooldownFromNow(5)}:R>).\n`,
            embeds: [], components: [row]
        });

        const collectorFilter = (i: ButtonInteraction) => i.user.id === targetUser.userId;
        const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 300000, filter: collectorFilter });

        collector.on("collect", async (confirmation) => {

            user = await UserController.removeCash(user, {
                from: user.userId,
                to: targetUser.userId,
                ammount
            });

            targetUser = await UserController.addCash(targetUser, {
                from: user.userId,
                to: targetUser.userId,
                ammount
            });

            confirm = new ButtonBuilder()
            .setCustomId("agree")
            .setLabel("Transferido")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true);

            row = new ActionRowBuilder<ButtonBuilder>().addComponents(confirm);

            await interaction.editReply({ components: [row]});

            await confirmation.reply({ content: `**${botConfig.GG} | ${mention}**, Você transferiu ${botConfig.getCashString(ammount)} para ${targetmention} com sucesso!`, embeds: [], components: [] })
            return;

        });

        collector.on("end", async () => {

            confirm = new ButtonBuilder()
            .setCustomId("agree")
            .setLabel("Transferência expirada")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true);

            row = new ActionRowBuilder<ButtonBuilder>().addComponents(confirm);

            await interaction.editReply({ components: [row]});
        });
    }

}