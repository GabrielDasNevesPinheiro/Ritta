import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CacheType, Colors, CommandInteraction, ComponentType, EmbedBuilder, Message, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import UserController from "../../database/controllers/UserController";
import { botConfig } from "../../app";
import { checkDisable, createNormalButton, createPagination, createSuccessButton, updateConfirmation } from "../../util/InteractionUtils";

export default abstract class EditPet extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("editpet")
        .setDescription("Edite o seu pet para a aposta")


    static async execute(interaction: CommandInteraction<CacheType>) {
        await interaction.deferReply({});
        let mention = await botConfig.mention(interaction.user.id);
        let user = await UserController.getUserById(interaction.user.id);

        if (!user || !user?.pets) return await interaction.editReply({ content: `${botConfig.CONFUSED} | ${mention}, Você não tem nenhum Pet.` });
        if (user.pets.length == 0) return await interaction.editReply({ content: `${botConfig.CONFUSED} | ${mention}, Você não tem nenhum Pet.` });

        let active = 0;

        let embeds = user.pets.map((pet) => new EmbedBuilder()
            .setTitle("Inventário de Pets")
            .setImage(`${interaction.client.emojis.cache.get(pet.split(":")[2].replace(">", "")).imageURL({ extension: "gif" })}`)
            .setTimestamp(new Date())
            .setColor(Colors.Green)
        );

        let prev = createNormalButton("<", "0", true);
        let setPet = createSuccessButton("Ativar", "1", user?.pet === user.pets[active]);
        let next = createNormalButton(">", "2");

        const checkButtons = () => checkDisable(prev, setPet, next, active < 1, user?.pet === user.pets[active], active >= embeds.length - 1);

        const prevPage = async (confirmation: ButtonInteraction<CacheType>) => {
            active -= 1;
            checkButtons();
            await updateConfirmation(interaction, confirmation, embeds[active], [row]);
        }

        const nextPage = async (confirmation: ButtonInteraction<CacheType>) => {
            active += 1;
            checkButtons();
            await updateConfirmation(interaction, confirmation, embeds[active], [row]);
        }

        const buyPet = async (confirmation: ButtonInteraction<CacheType>) => {
            
            user = await UserController.setPet(user.userId as string, user.pets[active] as string);
            checkButtons();

            await interaction.editReply({ components: [row] });
            await interaction.followUp({ content: `${botConfig.FRIGHT} | ${mention}, Seu pet foi ativado com sucesso.` });
            await confirmation.update({});
            return;
        }

        let row = new ActionRowBuilder<ButtonBuilder>().addComponents(prev, setPet, next);

        let response = await interaction.editReply({ components: [row], embeds: [embeds[active]] });

        await createPagination(response, row, prevPage, buyPet, nextPage);
    }

}