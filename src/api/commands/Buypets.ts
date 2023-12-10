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

        if (!user) return await interaction.editReply({ content: `${botConfig.CONFUSED} | <@${interaction.user.id}>, Tente realizar suas tarefas diárias primeiro.` });

        let pets = botConfig.pets.filter((pet) => user.pets?.indexOf(pet.emoji) == -1);

        if (pets.length == 0) return await interaction.editReply({ content: `${botConfig.CONFUSED} | <@${interaction.user.id}>, Parece que você já tem todos os pets.` });

        const buildEmbed = (item: { name: string, price: number, emoji: string }) =>
            new EmbedBuilder().setTitle(`${item.name} `)
                .setDescription(` ${botConfig.getCashString(item.price)}`)
                .setImage(interaction.client.emojis.cache.get(item.emoji.split(":")[2].replace(">", "")).imageURL({ extension: "gif" }))
                .setTimestamp(new Date())
                .setColor(Colors.Gold)

        let embeds = pets.map(buildEmbed);



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
            .setDisabled(pets[active].price > Number(user.coins))
            .setStyle(ButtonStyle.Success);

        let row = new ActionRowBuilder<ButtonBuilder>().addComponents(prev, buy, next);
        let text = `${botConfig.BRIGHT} Exibindo ${active + 1} de ${embeds.length}.`;
        let res = await interaction.editReply({ content: text, components: [row], embeds: [embeds[active]] });

        let collectorFilter = (i: ButtonInteraction) => i.user.id === interaction.user.id;
        const collector = res.createMessageComponentCollector({ componentType: ComponentType.Button, filter: collectorFilter, time: 140000 });

        collector.on("collect", async (confirmation) => {

            if (confirmation.customId === "buy") {
                user = await UserController.removeCash(user, {
                    from: user.userId,
                    to: `comprando o pet ${pets[active].name}`,
                    ammount: pets[active].price
                });

                user = await UserController.addPet(String(user.userId), pets[active].emoji);

                await confirmation.update({});
                await interaction.followUp({ content: `${botConfig.FRIGHT} | <@${interaction.user.id}>, Você adquiriu o pet ${pets[active].emoji}.`, ephemeral: true });


                pets = botConfig.pets.filter((pet) => user.pets?.indexOf(pet.emoji) == -1);
                embeds = pets.map(buildEmbed);

                let text = `${botConfig.BRIGHT} Exibindo pet ${active + 1} de ${embeds.length}.`;

                if (embeds.length == 0) {
                    await interaction.editReply({ content: `${botConfig.FRIGHT} | <@${interaction.user.id}>, Parece que não temos mais nada aqui.`, components: [], embeds: [] });
                    return;
                }
                await interaction.editReply({ content: text, components: [row], embeds: [embeds[active]] });

                return;
            }

            active += confirmation.customId === "next" ? 1 : -1;

            next.setDisabled(active >= embeds.length - 1);
            prev.setDisabled(active == 0);
            buy.setDisabled(pets[active].price > Number(user.coins));

            let text = `${botConfig.BRIGHT} Exibindo pet ${active + 1} de ${embeds.length}.`;
            await interaction.editReply({ content: text, components: [row], embeds: [embeds[active]] });
            await confirmation.update({});


        });



    }
}