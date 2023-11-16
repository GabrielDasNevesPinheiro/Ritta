import { CommandInteraction, CacheType, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { botConfig } from "../../app";
import { checkBetValues, getIntegerOption } from "../../util/InteractionUtils";
import UserController from "../../database/controllers/UserController";
import { getTigerResult } from "../../util/ImageUtils";
import { isVipExpired } from "../../util/DateUtils";
import { generateNeverMatchedArray, generateSparseArray, getTotalMultiplier } from "../../util/MatrixUtils";


export abstract class Tiger extends Command {


    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("tiger")
        .addIntegerOption(option =>
            option.setName("ammount")
                .setDescription("Quantidade a ser apostada")
                .setRequired(true)
                .setMinValue(20)
        ).setDescription("Aposte no tigrinho")

    static async execute(interaction: CommandInteraction<CacheType>) {

        await interaction.deferReply();

        let ammount: number = interaction.options.get("ammount").value as number;

        if (ammount < 20) return await interaction.editReply({ content: `**${botConfig.CONFUSED} | <@${interaction.user.id}>, Você precisa inserir no mínimo ${botConfig.getCashString(20)}.**` })

        let user = await UserController.getUserById(interaction.user.id);

        let res = await checkBetValues(String(ammount), interaction);

        if (!res) return;
        let tax = 0;

        let tigerArray: number[][] = [];
        let multiplier = 0;

        if(!isVipExpired(user).allowed) {

            tigerArray = generateSparseArray();
            multiplier = getTotalMultiplier(tigerArray);

        } else {

            let rand = Math.random();
            tax = 10 ** (ammount.toLocaleString("pt-BR").split(".")[1]?.length - 1 | 1);

            if(rand < (botConfig.normalBetChances)){

                tigerArray = generateSparseArray();
                multiplier = getTotalMultiplier(tigerArray)

            } else {

                tigerArray = generateNeverMatchedArray();
                multiplier = getTotalMultiplier(tigerArray)
                
            }
        }
        
        let response = await getTigerResult(tigerArray, multiplier > 0);

        if(multiplier > 0) {

            ammount *= multiplier
            ammount -= tax;
            user = await UserController.addCash(user, {
                from: "jogando tigrinho",
                to: user.userId,
                ammount: ammount
            });

            await interaction.editReply({ content: `${botConfig.STONKS} | <@${user.userId}>, Você ganhou ${botConfig.getCashString(ammount)} no tigrinho `+ '`' + `(${multiplier}x bônus)!` + '` ' +
            (tax > 0 ? `\n${botConfig.getCashString(tax)} de taxa.` : ``), files: [response] });
            
        } else {
            user = await UserController.removeCash(user, {
                from: "jogando tigrinho",
                to: user.userId,
                ammount: ammount
            });

            await interaction.editReply({ content: `${botConfig.NO_STONKS} | <@${user.userId}>, Você perdeu ${botConfig.getCashString(ammount)} no tigrinho, boa sorte na próxima vez!`, files: [response] });

        }

    }

}