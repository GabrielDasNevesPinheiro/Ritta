import { CacheType, CommandInteraction } from "discord.js";
import { botConfig } from "../app";
import UserController from "../database/controllers/UserController";
import { isVipExpired } from "./DateUtils";
import { IUser } from "../database/models/User";

export async function checkPayValues(targetUserId: string, optionAmmount: string, interaction: CommandInteraction<CacheType>): Promise<boolean> {

        let ammount: number = Number(Number(optionAmmount).toFixed(0));
        
        let targetUser = await UserController.getUserById(targetUserId);
        let user = await UserController.getUserById(interaction.user.id);

        if (ammount < 20) {
            await interaction.editReply({ content: `**${botConfig.CONFUSED} | <@${interaction.user.id}>, Você precisa inserir no mínimo ${botConfig.getCashString(20)}.**` })
            return false;
        }

        if(!targetUser) {
            await interaction.editReply({ content: `**${botConfig.CONFUSED} | <@${targetUserId}>, Tente realizar suas tarefas diárias primeiro.**`});
            return false;
        }
        if(!user) {
            await interaction.editReply({ content: `**${botConfig.CONFUSED} | <@${interaction.user.id}>, Tente realizar suas tarefas diárias primeiro.**`});
            return false;
        }
        
        if (user.userId === targetUser.userId) {
            await interaction.editReply({ content: `**${botConfig.NO} | Você precisa selecionar outro usuário.**` })
            return false;
        }

        if((user.coins as number < ammount)) {
            await interaction.editReply({ content: `**${botConfig.NO} | <@${interaction.user.id}>, Você não tem a quantia fornecida.**` })
            return false;
        }

        return true;
    }

    export async function checkBetValues(optionAmmount: string, interaction: CommandInteraction<CacheType>): Promise<boolean> {

        let ammount: number = getIntegerOption(optionAmmount);
        let max = 100000;
        if(isNaN(ammount)) {
            await interaction.editReply({ content: `**${botConfig.CONFUSED} | <@${interaction.user.id}>, Você precisa inserir um valor válido.**`})
            return false;
        }
        if (ammount < 20) {
            await interaction.editReply({ content: `**${botConfig.CONFUSED} | <@${interaction.user.id}>, Você precisa inserir no mínimo ${botConfig.getCashString(20)}.**` })
            return false;
        }

        let user = await UserController.getUserById(interaction.user.id);

        
        if(!user) {
            await interaction.editReply({ content: `**${botConfig.CONFUSED} | <@${interaction.user.id}>, Tente realizar suas tarefas diárias primeiro.**` });
            return false;
        }
        
        if((user.coins as number < ammount)) {
            await interaction.editReply({ content: `**${botConfig.NO} | <@${interaction.user.id}>, Você não tem a quantia fornecida.**` })
            return false;
        }

        return true;
    }


export async function checkMaxValues(interaction: CommandInteraction<CacheType>, user: IUser, ammount: number, bet: boolean = false): Promise<boolean> {

    let max = 50000;

    if(bet) max = 100000;

    if(!isVipExpired(user).allowed && !bet) max = 75000;

        if (ammount > max) {
            await interaction.editReply({ content: `**${botConfig.CONFUSED} | <@${interaction.user.id}>, Você só pode usar até** ${botConfig.getCashString(max)}.`});
            return false;
        }

        return true;
}

export function getIntegerOption(num: string) {
    let ammount: number = Number(Number(num).toFixed(0));
    return ammount;
} 

export function getTax(valor: number): number {
    const desconto = valor * 0.1;
    return desconto; 
}