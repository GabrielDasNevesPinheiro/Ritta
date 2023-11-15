import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, CommandInteraction, ComponentType, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import UserController from "../../database/controllers/UserController";
import { botConfig } from "../../app";
import { checkPayValues, getIntegerOption } from "../../util/InteractionUtils";
import { isVipExpired } from "../../util/DateUtils";
import { IUser } from "../../database/models/User";

export default class Pay extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("pay")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Usuário que receberá o pagamento")
                .setRequired(true)
        ).addStringOption(option =>
            option.setName("ammount")
                .setDescription("Quantidade desejada")
                .setRequired(true)
        )
        .setDescription("Efetue um pagamento à alguém");

    static async execute(interaction: CommandInteraction) {

        await interaction.deferReply();
        let targetUserId = interaction.options.getUser("user").id;
        let ammount: number = getIntegerOption(interaction);

        if (isNaN(ammount)) return await interaction.editReply({ content: `**${botConfig.CONFUSED} | <@${interaction.user.id}>, Você precisa inserir um valor válido.**` })


        let targetUser = await UserController.getUserById(targetUserId);
        let user = await UserController.getUserById(interaction.user.id);

        if (!targetUser) return await interaction.editReply({ content: `**${botConfig.CONFUSED} | <@${interaction.user.id}>, Não encontrei <@${targetUserId}> em meus registros.**` });

        if ((user.coins as number < ammount)) return await interaction.editReply({ content: `**${botConfig.NO} | <@${interaction.user.id}>, Você não tem a quantia fornecida para o pagamento.**` })

        if (user.userId === targetUser.userId) return await interaction.editReply({ content: `**${botConfig.NO} | Você não pode se transferir ${botConfig.cashname.toLowerCase()}.**` })

        if (ammount > botConfig.payLimit && isVipExpired(user).allowed) return await interaction.editReply({ content: `**${botConfig.NO} | <@${interaction.user.id}>, Torne-se __VIP__ para transferir mais de ${botConfig.getCashString(botConfig.payLimit)}.**` });


        let confirm = new ButtonBuilder()
            .setCustomId("agree")
            .setLabel("Confirmar")
            .setStyle(ButtonStyle.Success)

        let row = new ActionRowBuilder<ButtonBuilder>().addComponents(confirm);
        let embed = new EmbedBuilder().setTitle(`${botConfig.MONEY} Pagamento para ${interaction.client.users.cache.get(targetUserId).username}`)
            .setThumbnail(`${botConfig.IMG_RAINMONEY}`)
            .setDescription(`> Após a confirmação de ambos os envolvidos o pagamento de ${botConfig.getCashString(ammount)}`)
            .setColor(Colors.Green)

        let response = await interaction.editReply({ content: `<@${user.userId}> Aguardando a confirmação...`, embeds: [embed], components: [row] });

        let confirmed: IUser[] = [];
        const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 12000 });

        collector.on("collect", async (confirmation) => {
            
            if(confirmation.customId === "agree") {
                
                if(confirmation.user.id === user.userId) {
                    confirmed.push(user);
                    await confirmation.update({ content: `<@${confirmation.user.id}> Confirmou.`});
                }
                if(confirmation.user.id === targetUser.userId) {
                    confirmed.push(targetUser);
                    await confirmation.update({ content: `<@${confirmation.user.id}> Confirmou.`});
                }
                
                if(confirmed.length == 2) {

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

                    await confirmation.editReply({ content: `**${botConfig.GG} | <@${user.userId}>**, Você transferiu ${botConfig.getCashString(ammount)} para <@${targetUserId}> com sucesso!`, embeds: [], components: [] })
                    return;
                }

            }
            });
            collector.on("end", async(confirmation) => {
                if(confirmed.length != 2)
                    await interaction.editReply({ content: `**Tempo para confirmação encerrado.**`, embeds: [], components: []})
            });
        }

}