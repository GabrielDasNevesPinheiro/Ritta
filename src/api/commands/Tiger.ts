import { CommandInteraction, CacheType, SlashCommandBuilder, EmbedBuilder, Colors } from "discord.js";
import Command from "./Command";
import { botConfig } from "../../app";
import { checkBetValues, checkMaxValues, getIntegerOption, getTax } from "../../util/InteractionUtils";
import UserController from "../../database/controllers/UserController";
import { getTigerResult } from "../../util/ImageUtils";
import { isVipExpired, sleep } from "../../util/DateUtils";
import { generateNeverMatchedArray, generateSparseArray, getTotalMultiplier } from "../../util/MatrixUtils";


export abstract class Tiger extends Command {


    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("tiger")
        .addIntegerOption(option =>
            option.setName("ammount")
                .setDescription("Quantidade a ser apostada")
                .setRequired(true)
                .setMinValue(100)
        ).setDescription("Aposte no tigrinho")

    static async execute(interaction: CommandInteraction<CacheType>) {
        

        await interaction.deferReply();
        
        let mention = await botConfig.mention(interaction.user.id);

        let ammount: number = interaction.options.get("ammount").value as number;

        if (ammount < 20) return await interaction.editReply({ content: `**${botConfig.CONFUSED} | ${mention}, Você precisa inserir no mínimo ${botConfig.getCashString(20)}.**` })

        let user = await UserController.getUserById(interaction.user.id);

        let res = await checkBetValues(String(ammount), interaction);
        let canBet = await checkMaxValues(interaction, user, ammount);

        if(!canBet) return;
        if (!res) return;

        await interaction.editReply({
            content: `${botConfig.CASH} ${mention}, Boa sorte!`, embeds: [
                new EmbedBuilder().setTitle(`**${botConfig.THINKING} Hmmmmm...**`)
                    .setImage(botConfig.GIF_TIGER)
                    .setColor(Colors.Green)], components: []
        });
        
        await sleep(3000);

        let tax = 0;

        let tigerArray: number[][] = [];
        let multiplier = 0;

        if(!isVipExpired(user).allowed) {

            tigerArray = generateSparseArray();
            multiplier = getTotalMultiplier(tigerArray);

        } else {

            let rand = Math.random();
            tax = getTax(ammount);

            if(rand < (botConfig.normalBetChances + 0.1)){

                tigerArray = generateSparseArray();
                multiplier = getTotalMultiplier(tigerArray)

            } else {

                tigerArray = generateNeverMatchedArray();
                multiplier = getTotalMultiplier(tigerArray)
                
            }
        }
        
        let response = await getTigerResult(tigerArray, multiplier > 0);

        if(multiplier > 0) {

            ammount = Math.floor(ammount * multiplier);
            ammount -= tax;
            user = await UserController.addCash(user, {
                from: "jogando tigrinho",
                to: user.userId,
                ammount: ammount
            });

            await interaction.editReply({ content: `${botConfig.STONKS} | ${mention}, Você ganhou ${botConfig.getCashString(ammount)} no tigrinho `+ '`' + `(${multiplier}x bônus)!` + '` ' +
            (tax > 0 ? `\n${botConfig.getCashString(tax)} de taxa.` : ``), files: [response], embeds: [] });
            
        } else {
            user = await UserController.removeCash(user, {
                from: "jogando tigrinho",
                to: user.userId,
                ammount: ammount
            });

            await interaction.editReply({ content: `${botConfig.NO_STONKS} | ${mention}, Você perdeu ${botConfig.getCashString(ammount)} no tigrinho, boa sorte na próxima vez!`, files: [response], embeds: [] });

        }

    }

}