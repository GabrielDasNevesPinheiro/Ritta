import { CacheType, CommandInteraction } from "discord.js";
import { botConfig } from "../app";
import UserController from "../database/controllers/UserController";

export async function checkPayValues(targetUserId: string, optionAmmount: string, interaction: CommandInteraction<CacheType>): Promise<boolean> {

        let ammount: number = Number(Number(optionAmmount).toFixed(0));

        if(isNaN(ammount)) {
            await interaction.editReply({ content: `**${botConfig.CONFUSED} | <@${interaction.user.id}>, Você precisa inserir um valor válido.**`})
            return false;
        }
        
        let targetUser = await UserController.getUserById(targetUserId);
        let user = await UserController.getUserById(interaction.user.id);

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
            await interaction.editReply({ content: `**${botConfig.CONFUSED} | <@${interaction.user.id}>, Tente realizar suas tarefas diárias primeiro.**`});
            return false;
        }
        
        if((user.coins as number < ammount)) {
            await interaction.editReply({ content: `**${botConfig.NO} | <@${interaction.user.id}>, Você não tem a quantia fornecida.**` })
            return false;
        }

        return true;
    }


export function getIntegerOption(num: string) {
    let ammount: number = Number(Number(num).toFixed(0));
    return ammount;
} 