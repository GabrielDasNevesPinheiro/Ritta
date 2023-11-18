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


        let targetUser = await UserController.getUserById(targetUserId);
        let user = await UserController.getUserById(interaction.user.id);

        let res = await checkPayValues(targetUserId, String(ammount), interaction);

        if(!res) return;

        let confirm = new ButtonBuilder()
            .setCustomId("agree")
            .setLabel("PAGAR (0/2)")
            .setStyle(ButtonStyle.Success)

        let row = new ActionRowBuilder<ButtonBuilder>().addComponents(confirm);

        let response = await interaction.editReply({ content: 
            `${botConfig.CASH} | <@${targetUser.userId}>, <@${user.userId}> quer te enviar ${botConfig.getCashString(ammount)}, para aceitar, você e <@${user.userId}> devem clicar no botão __PAGAR__.\n`+
            `**A Equipe não se responsabiliza por roubos ou golpes.**\n`, embeds: [], components: [row] });
        let confirmed: IUser[] = [];

        const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 12000 });

        collector.on("collect", async (confirmation) => {
            
            if(confirmation.customId === "agree") {
                
                if(confirmation.user.id === user.userId && confirmed.indexOf(user) == -1) {
                    confirmed.push(user);
                    confirm = confirm.setLabel(`PAGAR (${confirmed.length}/2)`);
                    await confirmation.update({ components: [row]});
                }
                if(confirmation.user.id === targetUser.userId && confirmed.indexOf(targetUser) == -1) {
                    confirmed.push(targetUser);
                    confirm = confirm.setLabel(`PAGAR (${confirmed.length}/2)`);
                    await confirmation.update({ components: [row]});
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
        }

}