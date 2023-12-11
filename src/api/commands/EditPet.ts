import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CacheType, Colors, CommandInteraction, ComponentType, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import UserController from "../../database/controllers/UserController";
import { botConfig } from "../../app";

export default abstract class EditPet extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("editpet")
        .setDescription("Edite o seu pet para a aposta")


    static async execute(interaction: CommandInteraction<CacheType>) {
        await interaction.deferReply({});

        let user = await UserController.getUserById(interaction.user.id);

        if(!user || !user?.pets) return await interaction.editReply({ content: `${botConfig.CONFUSED} | <@${interaction.user.id}>, Você não tem nenhum Pet.`});
        if(user.pets.length == 0) return await interaction.editReply({ content: `${botConfig.CONFUSED} | <@${interaction.user.id}>, Você não tem nenhum Pet.`});

        let active = 0;

        let embeds = user.pets.map((pet) => new EmbedBuilder()
            .setTitle("Inventário de Pets")
            .setImage(`${interaction.client.emojis.cache.get(pet.split(":")[2].replace(">", "")).imageURL({ extension: "gif" })}`)
            .setTimestamp(new Date())
            .setColor(Colors.Green)
        );

        let prev = new ButtonBuilder()
            .setLabel("<")
            .setCustomId("prev")
            .setDisabled(true)
            .setStyle(ButtonStyle.Secondary);

        let next = new ButtonBuilder()
            .setLabel(">")
            .setCustomId("next")
            .setStyle(ButtonStyle.Secondary);

        let setPet = new ButtonBuilder()
            .setLabel("Ativar")
            .setCustomId("active")
            .setDisabled(user?.pet === user.pets[active])
            .setStyle(ButtonStyle.Success);

        let row = new ActionRowBuilder<ButtonBuilder>().addComponents(prev, setPet, next);

        let response = await interaction.editReply({ components: [row], embeds: [embeds[active]]});

        let collectorFilter = (i: ButtonInteraction) => i.user.id === interaction.user.id;
        let collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, filter: collectorFilter, time: 140000 });

        collector.on("collect", async(confirmation) => {

            if(confirmation.customId === "active") {
                
                user = await UserController.setPet(user.userId as string, user.pets[active] as string);
                setPet.setDisabled(user?.pet === user.pets[active]);

                await interaction.editReply({ components: [row] });
                await interaction.followUp({ content: `${botConfig.FRIGHT} | <@${interaction.user.id}>, Seu pet foi ativado com sucesso.` });
                await confirmation.update({});
                return;
            }

            active += confirmation.customId === "next" ? 1 : -1;

            next.setDisabled(active >= embeds.length - 1);
            prev.setDisabled(active == 0);
            setPet.setDisabled(user?.pet === user.pets[active]);

            await interaction.editReply({ components: [row], embeds: [embeds[active]]});
            await confirmation.update({});

        });
    }

}