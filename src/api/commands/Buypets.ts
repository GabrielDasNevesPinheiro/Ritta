import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CacheType, Colors, CommandInteraction, ComponentType, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { botConfig } from "../../app";
import UserController from "../../database/controllers/UserController";


export default abstract class Buypets extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("buypets")
        .setDescription("Compre pets")

    static async execute(interaction: CommandInteraction<CacheType>) {

        await interaction.deferReply({});

        let user = await UserController.getUserById(interaction.user.id);

        if(!user) return await interaction.editReply({ content: `${botConfig.CONFUSED} | <@${interaction.user.id}>, Tente realizar suas tarefas diárias primeiro.` });

        let embeds = botConfig.pets.map((item) => 
        new EmbedBuilder().setTitle(`${item.name} `)
        .setDescription(` ${botConfig.getCashString(item.price)}`)
        .setImage(interaction.client.emojis.cache.get(item.emoji.split(":")[2].replace(">", "")).url)
        .setTimestamp(new Date())
        .setColor(Colors.Gold)
        );
        
        let active = 0;

        let prev = new ButtonBuilder()
        .setLabel("<")
        .setCustomId("prev")
        .setDisabled(true)
        .setStyle(ButtonStyle.Secondary);

        let next = new ButtonBuilder()
        .setLabel(">")
        .setCustomId("next")
        .setStyle(ButtonStyle.Secondary);

        let buy = new ButtonBuilder()
        .setLabel("Comprar")
        .setCustomId("buy")
        .setDisabled(botConfig.pets[active].price > Number(user.coins))
        .setStyle(ButtonStyle.Success);

        let row = new ActionRowBuilder<ButtonBuilder>().addComponents(prev, buy, next);
        let text = `${botConfig.BRIGHT} Exibindo ${active + 1} de ${embeds.length}.`;
        let res = await interaction.editReply({ content: text, components: [row], embeds: [embeds[active]]});

        let collectorFilter = (i: ButtonInteraction) => i.user.id === interaction.user.id;
        const collector = res.createMessageComponentCollector({ componentType: ComponentType.Button, filter: collectorFilter, time: 140000 });

        collector.on("collect", async(confirmation) => {

            active += confirmation.customId === "next" ? 1 : -1;

            next.setDisabled(active >= embeds.length - 1);
            prev.setDisabled(active == 0);
            buy.setDisabled(botConfig.pets[active].price > Number(user.coins));

            let text = `${botConfig.BRIGHT} Exibindo pet ${active + 1} de ${embeds.length}.`;
            await interaction.editReply({ content: text, components: [row], embeds: [embeds[active]]});
            await confirmation.update({});


        });

        

    }
}