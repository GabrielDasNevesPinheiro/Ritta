import { ActionRowBuilder, CacheType, CommandInteraction, ComponentType, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import Command from "./Command";
import UserController from "../../database/controllers/UserController";
import { botConfig } from "../../app";
import { titles } from "../../database/static/TitleList";

export default abstract class SetTitle extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("settitle")
        .setDescription("Ative algum de seus títulos")

    static async execute(interaction: CommandInteraction<CacheType>) {
        await interaction.deferReply({ ephemeral: true });

        let user = await UserController.getUserById(interaction.user.id);

        if (!user) return await interaction.editReply({ content: `${botConfig.CONFUSED} | <@${interaction.user.id}> Complete suas tarefas diárias primeiro.` });
        if(user?.titles?.length < 1) return await interaction.editReply({ content: `${botConfig.CONFUSED} | <@${interaction.user.id}> Você não possui nenhum título.` });

        let select = new StringSelectMenuBuilder()
            .setCustomId("select")
            .setPlaceholder("Selecione um Título")
            .addOptions(user?.titles?.map((title, index) => 
                new StringSelectMenuOptionBuilder()
                .setLabel(String(title)).setEmoji(titles[String(title)].icon).setValue(`${index}`)
            ));

        let row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);
        let res = await interaction.editReply({ content: `Apenas selecione para ativar.`, components: [row] });

        try {
            let confirmation = await res.awaitMessageComponent({ componentType: ComponentType.StringSelect, time: 60_000 });
            user.activatedTitle = user.titles[Number(confirmation.values[0])];
            user = await UserController.updateUser(interaction.user.id, user);
            await confirmation.update({ components: [] });
            await interaction.editReply({ content: `${botConfig.OK} | <@${interaction.user.id}>, Você ativou ${user.titles[Number(confirmation.values[0])]} com sucesso.` });

        } catch (error) {
            
        }
    }
}