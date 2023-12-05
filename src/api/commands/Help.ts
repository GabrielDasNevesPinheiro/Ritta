import { CacheType, Colors, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { botConfig } from "../../app";


export default class Help extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("help")
        .addIntegerOption(option =>
            option.setName("category")
                .setDescription("Categoria de comandos")
                .setRequired(true)
                .addChoices({ name: "Economia", value: 0 }, { name: "Utilidades", value: 1 })
        ).setDescription("Veja os meus comandos")

    static async execute(interaction: CommandInteraction<CacheType>) {


        await interaction.deferReply({ ephemeral: true });
        let category = interaction.options.get("category").value as number;

        let embed: EmbedBuilder = null;

        if (category == 0) embed = new EmbedBuilder()
            .setTitle("Comandos de Economia")
            .setDescription(
                "`/atm`\n" +
                "`/coinflip`\n" +
                "`/cooldowns`\n" +
                "`/crime`\n" +
                "`/daily`\n" +
                "`/work`\n" +
                "`/weekly`\n" +
                "`/double`\n" +
                "`/top`\n" +
                "`/mines`\n" +
                "`/tiger`\n" +
                "`/horse`\n" +
                "`/scratch`\n" +
                "`/roulette`\n" +
                "`/jackpot`\n" +
                "`/dice`\n" +
                "`/pay`\n" +
                "`/raffle`\n" +
                "`/claim`\n" +
                "`/tasks`\n" +
                "`/transactions`\n" 
            ).setTimestamp(new Date()).setColor(Colors.Green)

        if (category == 1) embed = new EmbedBuilder()
            .setTitle("Comandos de Utilidades")
            .setDescription(
                "`/botinfo`\n" +
                "`/marry`\n" +
                "`/rep`\n" +
                "`/reps`\n" +
                "`/vip`\n" +
                "`/vote`\n" +
                "`/ban`\n" +
                "`/banlist`\n" +
                "`/editemoji`\n" +
                "`/profile`\n" +
                "`/aboutme`\n"
            ).setTimestamp(new Date()).setColor(Colors.Green)

            await interaction.editReply({ embeds: [embed] })


    }
}