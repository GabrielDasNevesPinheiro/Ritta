import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CacheType, CommandInteraction, ComponentType, EmbedBuilder, Interaction, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuComponent, StringSelectMenuInteraction, StringSelectMenuOptionBuilder } from 'discord.js';
import Command from "./Command";
import { titles } from "../../database/static/TitleList";
import { botConfig } from '../../app';


export default abstract class TitleCommand extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("title")
        .addStringOption(option =>
            option.setName("name")
                .setDescription("O Texto a ser exibido em seu título")
                .setRequired(true)
        )
        .setDescription("Adquira um título")

    static async execute(interaction: CommandInteraction<CacheType>) {
        await interaction.deferReply({});
        let name = (interaction.options.get("name")?.value as string).toLowerCase();

        let values = Object.keys(titles);

        if (!titles[values[0]].translate(name)) {
            return await interaction.editReply({ content: `${botConfig.CONFUSED} | <@${interaction.user.id}> Digite apenas caracteres válidos para seu título.` });
        }

        let select = new StringSelectMenuBuilder()
            .setCustomId("titles")
            .setPlaceholder("Selecione aqui")
            .addOptions(values.map((value, index) =>
                new StringSelectMenuOptionBuilder().setLabel(`${value}`).setEmoji(titles[value].icon).setValue(`${index}`).setDescription(botConfig.getCashString(titles[value].price).split(">")[1].replace("**", ""))
            ));


        let row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);
        let res = await interaction.editReply({ components: [row] });

        try {

            let filter = (i: Interaction) => i.user.id === interaction.user.id;
            let response = await res.awaitMessageComponent({ componentType: ComponentType.StringSelect, filter, time: 60_000 });
            await response.update({});

            let selectedName = values[Number(response.values[0])];
            let selected = titles[selectedName];
            
            let embed = new EmbedBuilder()
                .setTitle("CONFIRMAR")
                .addFields(
                    { name: "Nome", value: selectedName, inline: true },
                    { name: "Preço", value: `${selected.price.toLocaleString("pt-BR")}`, inline: true },
                    { name: "Exemplo", value: `${selected.icon} ${selected.translate(name)}`, inline: false }
                );
        
            let buy = new ButtonBuilder()
                    .setLabel("CONFIRMAR")
                    .setStyle(ButtonStyle.Success)
                    .setCustomId("buy")
            let row = new ActionRowBuilder<ButtonBuilder>().addComponents(buy);

            let buttonRes = await interaction.followUp({ embeds: [embed], components: [row] });

            let confirmation = await buttonRes.awaitMessageComponent({ componentType: ComponentType.Button, filter, time: 60_000 });

            
            await confirmation.update({});
            await confirmation.followUp({ content: `${botConfig.FRIGHT} | <@${interaction.user.id}> Você comprou ${selectedName} com sucesso.` });

        } catch (error) {
            await interaction.editReply({ components: [], content: `Tempo de compra expirado.` });
        }
    }

}