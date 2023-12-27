import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CacheType, CommandInteraction, ComponentType, SlashCommandBuilder, User } from "discord.js";
import Command from "./Command";
import UserController from "../../database/controllers/UserController";
import getRank from "../../util/ImageUtils";
import { botConfig } from "../../app";

export default abstract class Top extends Command {
    
    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("top")
        .addIntegerOption(option =>
            option.setName("page")
            .setDescription("Página do ranking")    
            .setMinValue(1)
        ).setDescription("Exibe o ranking dos melhores");

    static async execute(interaction: CommandInteraction<CacheType>) {

        let page: number = interaction.options.get("page")?.value as number ?? 1;
        page = page > 0 ? page - 1 : page;

        let mention = await botConfig.mention(interaction.user.id);

        await interaction.deferReply({});
        await interaction.editReply({ content: `${botConfig.WAITING} | ${mention}, um momento...` });

        let users = await UserController.getRanking();
        let fetched: User[] = [];

        for(let user of users) {
            fetched.push(await interaction.client.users.fetch(String(user.userId)));
        }

        let pagesCount = Math.floor(fetched.length / 5);
        page = page > pagesCount ? pagesCount : page;

        let ranking = await getRank(fetched, users, page);

        let next = new ButtonBuilder()
        .setCustomId("next")
        .setStyle(ButtonStyle.Secondary)
        .setLabel("Próximo")
        .setDisabled(page >= pagesCount);

        let prev = new ButtonBuilder()
        .setCustomId("prev")
        .setStyle(ButtonStyle.Secondary)
        .setLabel("Anterior")
        .setDisabled(page == 0);

        let row = new ActionRowBuilder<ButtonBuilder>().addComponents(prev, next);

        let response = await interaction.editReply({ files: [ranking], content: `🏆 Página ${page + 1} de ${pagesCount + 1} `, components: [row] });

        let collectorFilter = (i: ButtonInteraction) => i.user.id === interaction.user.id;
        const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 120000, filter: collectorFilter });

        collector.on("collect", async (confirmation) => {

            if(confirmation.customId === "next") page += 1;
            if(confirmation.customId === "prev") page -= 1;

            next.setDisabled(page >= pagesCount);
            prev.setDisabled(page == 0);

            ranking = await getRank(fetched, users, page);
            
            await interaction.editReply({ content: `🏆 Página ${page + 1} de ${pagesCount + 1}`, files: [ranking], components: [row] });
            await confirmation.update({});

        });

    }
}