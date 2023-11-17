import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { checkBetValues, checkMaxValues, getTax } from "../../util/InteractionUtils";
import { getJackpotResult } from "../../util/ImageUtils";
import { getJackpotOperation, sortJackpotArray } from "../../util/MatrixUtils";
import UserController from "../../database/controllers/UserController";
import { isVipExpired } from "../../util/DateUtils";
import { botConfig } from "../../app";


export default abstract class Jackpot extends Command {
    
    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("jackpot")
        .addIntegerOption(option => 
            option.setName("ammount")
            .setDescription("Quantidade da aposta")
            .setMinValue(1500)
            .setRequired(true)
            ).setDescription("Aposte no jackpot")
            
    static async execute(interaction: CommandInteraction<CacheType>) {
        
        await interaction.deferReply({});

        let ammount = interaction.options.get("ammount").value as number;

        let res = await checkBetValues(String(ammount), interaction);
        
        if(!res) return;
        
        
        let jackpot = sortJackpotArray();
        let result = await getJackpotResult(jackpot);
        let operation = getJackpotOperation(jackpot);
        let tax = getTax(ammount);
        
        let user = await UserController.getUserById(interaction.user.id);
        let canBet = await checkMaxValues(interaction, user, ammount);

        if(!canBet) return;

        if(!isVipExpired(user).allowed) {
            tax = 0;
        }

        if(operation === "win") {
            ammount *= 2;
            if(tax > 0) tax = getTax(ammount);
            ammount -= tax;
            user = await UserController.addCash(user, {
                from: "jogando jackpot",
                to: user.userId,
                ammount: ammount
            });
            
            return await interaction.editReply({ content: `${botConfig.STONKS} | <@${user.userId}>, Você ganhou ${botConfig.getCashString(ammount)}`+ '`'+`(2x Bônus)`+'`'+` no Jackpot!\n`+
            (tax > 0 ? `${botConfig.getCashString(tax)} de taxa.` : ``), files: [result]
        });
    }

        if(operation === "defeat") {
            
            user = await UserController.removeCash(user, {
                from: user.userId,
                to: "jogando jackpot",
                ammount: ammount
            });

            return await interaction.editReply({ content: `${botConfig.NO_STONKS} | <@${user.userId}>, Você perdeu ${botConfig.getCashString(ammount)} no Jackpot.\n`, files: [result]});

        }

        if(operation === "removePoints") {
            ammount += getTax(ammount);
            user = await UserController.removeCash(user, {
                from: user.userId,
                to: "jogando jackpot",
                ammount: ammount
            });

            return await interaction.editReply({ content: `${botConfig.NO_STONKS} | <@${user.userId}>, Você perdeu ${botConfig.getCashString(ammount)} no Jackpot.\n` + `Pelo resultado **A Casa** leva mais ${botConfig.getCashString(getTax(ammount))}.`, files: [result]});

        }
    }
}