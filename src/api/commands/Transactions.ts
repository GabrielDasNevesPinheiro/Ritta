import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CacheType, Colors, CommandInteraction, ComponentType, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { ITransaction } from "../../database/models/Transaction";
import TransactionController from "../../database/controllers/TransactionController";
import moment from 'moment';
import { botConfig } from "../../app";


export default class Transactions extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("transactions")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Escolha o usuário")
        ).setDescription("Exibe as transações do usuário")


    static async execute(interaction: CommandInteraction<CacheType>) {

        await interaction.deferReply({});

        let targetUser = interaction.options.getUser("user") || interaction.user;

        let transactions = await TransactionController.getAllTransactions(targetUser.id);

        if(transactions.length == 0) return await interaction.editReply({ content: `${botConfig.CONFUSED} | <@${interaction.user.id}>, Não encontrei transações.` });

        let list = generateTransactionPage(targetUser.id, transactions);
        let embeds: EmbedBuilder[] = [];
        let page = 0;
        for (let page of list) {

            let text = ""
            page.forEach((register) => {
                text += register + "\n";
            });

            embeds.push(new EmbedBuilder().setTitle(`:money_with_wings: Transações de ${targetUser.username} (${list.indexOf(page) + 1}/${list.length})`)
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
    return function (transaction: ITransaction) {

        const isReceived = transaction.to === userId;
        const action = isReceived ? '📥 | Recebeu' : '📤 | Enviou';
        const amount = transaction.ammount;

        const date = transaction.createdAt.toLocaleDateString("pt-BR");
        const unix = moment(transaction.createdAt);


        const formattedString = `${date} | <t:${unix.unix()}:R> ${action} ${botConfig.getCashString(Number(amount))} ${isReceived ? transaction.from : transaction.to}`;

        return formattedString;
    };
}

function generateTransactionPage(userId: string, transactions: ITransaction[]): string[][] {
    const pageSize = 10;
    const pages = [];

    for (let i = 0; i < transactions.length; i += pageSize) {
        const pageTransactions = transactions.slice(i, i + pageSize);
        const formattedTransactions = pageTransactions.map(formatTransaction(userId));
        pages.push(formattedTransactions);
    }

    return pages;
}
