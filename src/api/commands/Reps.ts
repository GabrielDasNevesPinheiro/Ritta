import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CacheType, Collection, Colors, CommandInteraction, ComponentType, EmbedBuilder, SlashCommandBuilder, User } from "discord.js";
import Command from "./Command";
import { ITransaction } from "../../database/models/Transaction";
import TransactionController from "../../database/controllers/TransactionController";
import moment from 'moment';
import { botConfig } from "../../app";
import UserController from "../../database/controllers/UserController";
import { IReputation } from "../../database/models/Reputation";


export default class Reps extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("reps")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Escolha o usuário")
        ).setDescription("Exibe as reputações do usuário")


    static async execute(interaction: CommandInteraction<CacheType>) {

        await interaction.deferReply({});

        let targetUser = interaction.options.getUser("user") || interaction.user;
        let mention = await botConfig.mention(interaction.user.id);

        

        let reps = await UserController.getReps(targetUser.id);

        if(reps.length == 0) return await interaction.editReply({ content: `${botConfig.CONFUSED} | ${mention}, Não encontrei reputações.` });


        let list = generateReputationPage(targetUser.id, reps);
        let embeds: EmbedBuilder[] = [];
        let page = 0;
        for (let page of list) {

            let text = ""
            page.forEach((register) => {
                text += register + "\n";
            });

            embeds.push(new EmbedBuilder().setTitle(`:star: Reputações de ${targetUser.username} (${list.indexOf(page) + 1}/${list.length})`)
                .setDescription(text).setColor(Colors.Blue)
            )


        }

        let prev = new ButtonBuilder().setLabel("◀️").setCustomId("prev").setStyle(ButtonStyle.Secondary).setDisabled(page == 0);
        let next = new ButtonBuilder().setLabel("▶️").setCustomId("next").setStyle(ButtonStyle.Secondary).setDisabled(page >= list.length - 1);
        let row = new ActionRowBuilder<ButtonBuilder>().addComponents(prev, next);
        
        let response = await interaction.editReply({ embeds: [embeds[page]], components: [row] });

        const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 30000 });

        collector.on("collect", async(confirmation) => {

            if(confirmation.user.id !== interaction.user.id) return;

            if(confirmation.customId === "prev" && page > 0) {
                page -= 1
            }
            if(confirmation.customId === "next" && page < list.length - 1) {
                page += 1;    
            }

            prev.setDisabled(!(page > 0));
            next.setDisabled(page >= list.length - 1);
            await confirmation.update({ components: [row] });
            await interaction.editReply({ embeds: [embeds[page]]});

        });

    }
}

function formatTransaction(userId: string) {
    return function (rep: IReputation) {

        const isReceived = rep.to === userId;
        const action = isReceived ? '📥 | Recebeu de' : '📤 | Enviou para';
        const message = rep.message;

        const date = rep.createdAt.toLocaleDateString("pt-BR");
        const unix = moment(rep.createdAt);


        const formattedString = `${date} | <t:${unix.unix()}:R> ${action}  ${isReceived ? `<@${rep.from}>` : `<@${rep.to}>` }: ${'`'+ message +'`'}`;

        return formattedString;
    };
}

function generateReputationPage(userId: string, reputations: IReputation[]): string[][] {
    const pageSize = 10;
    const pages = [];

    for (let i = 0; i < reputations.length; i += pageSize) {
        const pageTransactions = reputations.slice(i, i + pageSize);
        const formattedTransactions = pageTransactions.map(formatTransaction(userId));
        pages.push(formattedTransactions);
    }

    return pages;
}
