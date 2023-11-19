import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CacheType, CommandInteraction, ComponentType, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import UserController from "../../database/controllers/UserController";
import { botConfig } from "../../app";


export default abstract class Marry extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("marry")
        .addIntegerOption(option =>
            option.setName("operation")
                .setDescription("Selecione o que quer fazer")
                .setRequired(true)
                .addChoices({ name: "Casar", value: 0 }, { name: "Divorciar", value: 1 }, { name: "Exibir parceiro(a)", value: 2 })
        ).addUserOption(option =>
            option.setName("user")
                .setDescription("Usuário para casar ou divorciar")
        ).setDescription("Case-se ou divorcie-se")

    static async execute(interaction: CommandInteraction<CacheType>) {
        await interaction.deferReply({});
        let thisuser = await UserController.getUserById(interaction.user.id);
        let targetUser = await UserController.getUserById(interaction.options.getUser("user")?.id);
        let operation = interaction.options.get("operation").value as number;

        if(operation == 2) {

            if(!thisuser?.partner) return await interaction.editReply({ content: `${botConfig.CONFUSED} | <@${interaction.user.id}>, Você não tem casamento nenhum.`, components: [] });

            await interaction.editReply({ content: `${botConfig.CONFUSED} | <@${thisuser.userId}>, Você está em um casamento com <@${thisuser.partner}>.`, components: [] });
            return ;
        }
        if (!thisuser) return await interaction.editReply({ content: `${botConfig.CONFUSED} | <@${interaction.user.id}>, Você não pode se casar.` });
        if (!targetUser || thisuser?.userId === targetUser?.userId) return await interaction.editReply({ content: `${botConfig.CONFUSED} | <@${interaction.user.id}>, Você precisa escolher outro usuário.` });


        if (operation == 0) {

            if(thisuser.partner) return await interaction.editReply({ content: `${botConfig.CONFUSED} | <@${interaction.user.id}>, Você já está em um casamento.` });
            if(targetUser.partner) return await interaction.editReply({ content: `${botConfig.CONFUSED} | <@${targetUser.userId}>, Você já está em um casamento.` });


            let row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder().setLabel("Aceitar").setCustomId("accept").setStyle(ButtonStyle.Success),
                new ButtonBuilder().setLabel("Recusar").setCustomId("denie").setStyle(ButtonStyle.Danger),
            );

            let res = await interaction.editReply({ content: `${botConfig.PEPEHEART} | <@${targetUser.userId}>, <@${thisuser.userId}> quer se casar com você!`, components: [row] });

            const collector = res.createMessageComponentCollector({ componentType: ComponentType.Button, time: 15000 });

            collector.on("collect", async (confirmation) => {

                if (confirmation.user.id !== targetUser.userId) return;
                if (confirmation.customId === "accept") {
                    thisuser.partner = targetUser.userId;
                    targetUser.partner = thisuser.userId;
                    thisuser = await UserController.updateUser(String(thisuser.userId), thisuser);
                    targetUser = await UserController.updateUser(String(targetUser.userId), targetUser);

                    await interaction.editReply({ content: `${botConfig.LOVE} | <@${targetUser.userId}>, <@${thisuser.userId}> Parabéns! Vocês agora são um casal💝.`, components: [] });

                } else {
                    await interaction.editReply({ content: `${botConfig.CRYING} | <@${thisuser.userId}>, <@${targetUser.userId}> não quis se casar com você, bola pra frente!`, components: [] });
                    return;
                }
            });
        } else if (operation == 1) {
            let row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder().setLabel("Aceitar").setCustomId("accept").setStyle(ButtonStyle.Success),
                new ButtonBuilder().setLabel("Recusar").setCustomId("denie").setStyle(ButtonStyle.Danger),
            );

            if(thisuser.partner !== targetUser.userId) return await interaction.editReply({ content: `${botConfig.CONFUSED} | <@${interaction.user.id}>, Você não é casado com <@${targetUser.userId}>.` });

            let res = await interaction.editReply({ content: `${botConfig.CRYING} | <@${targetUser.userId}>, <@${thisuser.userId}> quer se divorciar de você!`, components: [row] });

            const collector = res.createMessageComponentCollector({ componentType: ComponentType.Button, time: 15000 });

            collector.on("collect", async (confirmation) => {

                if (confirmation.user.id !== targetUser.userId) return;
                if (confirmation.customId === "accept") {
                    thisuser.partner = null;
                    targetUser.partner = null;
                    thisuser = await UserController.updateUser(String(thisuser.userId), thisuser);
                    targetUser = await UserController.updateUser(String(targetUser.userId), targetUser);

                    await interaction.editReply({ content: `${botConfig.CRYING} | <@${targetUser.userId}>, <@${thisuser.userId}> vocês se divorciaram.`, components: [] });

                } else {
                    await interaction.editReply({ content: `${botConfig.CONFUSED} | <@${thisuser.userId}>, <@${targetUser.userId}> recusou o divórcio.`, components: [] });
                    return;
                }
            });
        }

    }

}