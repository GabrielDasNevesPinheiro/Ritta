import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CacheType, Colors, CommandInteraction, ComponentType, EmbedBuilder, Interaction, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuComponent, StringSelectMenuInteraction, StringSelectMenuOptionBuilder } from 'discord.js';
import Command from "./Command";
import { titles } from "../../database/static/TitleList";
import { botConfig } from '../../app';
import UserController from '../../database/controllers/UserController';


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

        let mention = await botConfig.mention(interaction.user.id);

        let name = (interaction.options.get("name")?.value as string).toLowerCase();

        let user = await UserController.getUserById(interaction.user.id);

        if (!user) return await interaction.editReply({ content: `${botConfig.CONFUSED} | ${mention} Complete suas tarefas diárias primeiro.` });

        user.titleName = name;
        user = await UserController.updateUser(String(user.userId), user);

        let values = Object.keys(titles).filter((name) => !user?.titles?.includes(name));

        if (values.length < 1) return await interaction.editReply({ content: `${botConfig.CONFUSED} | ${mention} Você já adquiriu todos os títulos.` });

        if (!titles[values[0]].translate(name)) {
            return await interaction.editReply({ content: `${botConfig.CONFUSED} | ${mention} Digite apenas caracteres válidos para seu título.` });
        }

        let select = new StringSelectMenuBuilder()
            .setCustomId("titles")
            .setPlaceholder("Selecione aqui")
            .addOptions(values.map((value, index) =>
                new StringSelectMenuOptionBuilder().setLabel(`${value}`).setEmoji(titles[value].icon).setValue(`${index}`).setDescription(botConfig.getCashString(titles[value].price).split(">")[1].replace("**", ""))
            ));

        let embed = new EmbedBuilder().setTitle("Títulos")
            .setDescription("Os Títulos servem para decorar seu nome em comandos de Economia/Apostas. (Títulos não dão nenhuma vantagem adicional ao compra-los)" +
            "\n\nPara você comprar um novo Título ou pré-visualizar utilize o Menu!"+
            "\n\n:information_source: Para visualizar ou alterar títulos utilize `/settitle`."
            ).setColor(Colors.Purple)

        let row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);
        let res = await interaction.editReply({ components: [row], embeds: [embed] });

        try {

            let filter = (i: Interaction) => i.user.id === interaction.user.id;
            let response = await res.awaitMessageComponent({ componentType: ComponentType.StringSelect, filter, time: 60_000 });
            await response.update({ components: [] });

            let selectedName = values[Number(response.values[0])];
            let selected = titles[selectedName];

            let embed = new EmbedBuilder()
                .setTitle("CONFIRMAR")
                .addFields(
                    { name: "Nome", value: selectedName, inline: true },
                    { name: "Preço", value: `${selected.price.toLocaleString("pt-BR")}`, inline: true },
                    { name: "Exemplo", value: `${selected.icon} ${selected.translate(name)}`, inline: false }
                ).setColor(Colors.Purple);

            let buy = new ButtonBuilder()
                .setLabel("CONFIRMAR")
                .setStyle(ButtonStyle.Success)
                .setCustomId("buy")
            let row = new ActionRowBuilder<ButtonBuilder>().addComponents(buy);

            let buttonRes = await interaction.followUp({ embeds: [embed], components: [row] });

            let confirmation = await buttonRes.awaitMessageComponent({ componentType: ComponentType.Button, filter, time: 60_000 });


            await confirmation.update({ components: [] });

            if (selected.price > Number(user.coins)) return await interaction.followUp({ content: `${botConfig.CONFUSED} | ${mention} Parece que você não tem a quantia necessária para a compra.` });

            user = await UserController.removeCash(user, {
                from: user.userId,
                to: `comprando o título ${selectedName}`,
                ammount: selected.price
            });
            user = await UserController.addTitle(String(user.userId), selectedName);

            await confirmation.followUp({ content: `${botConfig.FRIGHT} | ${mention} Você comprou ${selectedName} com sucesso.` });

        } catch (error) {
            await interaction.editReply({ components: [], content: `Tempo de compra expirado.` });
        }
    }

}