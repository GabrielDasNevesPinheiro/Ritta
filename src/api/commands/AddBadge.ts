import { ActionRowBuilder, CacheType, CommandInteraction, ComponentType, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction, StringSelectMenuOptionBuilder, User } from "discord.js";
import Command from "./Command";
import UserController from "../../database/controllers/UserController";
import { botConfig } from "../../app";
import { Store } from "../../database/models/Store";

export default abstract class AddBadge extends Command {


    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("addbadge")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Usuário desejado")
                .setRequired(true)
        )
        .setDescription("Adicione uma insígnia restrita à um usuário")


    static async execute(interaction: CommandInteraction<CacheType>) {
        await interaction.deferReply({ ephemeral: true });

        let targetUser = interaction.options.getUser("user");

        let user = await UserController.getUserById(targetUser.id);

        if (!user) return await interaction.editReply({ content: `Este usuário não está no banco de dados.` });

        let names = ["VIP", "Bug Hunter", "Moderator", "Booster", "Developer", "Admin", "Nitro"];

        let menu = new StringSelectMenuBuilder()
            .setPlaceholder("Selecione uma insígnia")
            .setCustomId("select")
            .addOptions(names.map((name) =>
                new StringSelectMenuOptionBuilder().setLabel(name).setDescription(`Selecione para adicionar a insígnia ${name} para o usuário`).setValue(name)
            ));

        let row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);

        let res = await interaction.editReply({ components: [row] });

        let collectorFilter = (i: StringSelectMenuInteraction) => botConfig.admins.includes(i.user.id);
        let collector = res.createMessageComponentCollector({ componentType: ComponentType.StringSelect, filter: collectorFilter, time: 60_000 });

        collector.on('collect', async (confirmation) => {
            await confirmation.update({});

            let badge = await Store.findOne({ name: confirmation.values[0] });

            if (!user.inventory.includes(badge._id)) {
                user.inventory.push(badge._id);
                user = await UserController.updateUser(String(user.userId), user);
                await confirmation.followUp({ ephemeral: true, content: `Insígnia ${badge.name} adicionada no inventário de <@${targetUser.id}>.` });
            } else {
                await confirmation.update({ components: [] });
                await interaction.editReply({ content: `O usuário já possui esta insígnia.` });
            }

        });

    }
}