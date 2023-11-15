import { CacheType, CommandInteraction } from "discord.js";
import { botConfig } from "../app";
import UserController from "../database/controllers/UserController";

export async function checkPayValues(interaction: CommandInteraction<CacheType>) {

        let targetUserId = interaction.options.getUser("user").id;
        let ammount: number = Number(Number(interaction.options.get("ammount").value).toFixed(0));

        if(isNaN(ammount)) return await interaction.editReply({ content: `**${botConfig.CONFUSED} | <@${interaction.user.id}>, Você precisa inserir um valor válido.**`})

        
        let targetUser = await UserController.getUserById(targetUserId);
        let user = await UserController.getUserById(interaction.user.id);

        if(!targetUser) return await interaction.editReply({ content: `**${botConfig.CONFUSED} | <@${interaction.user.id}>, Não encontrei <@${targetUserId}> em meus registros.**`});

        if((user.coins as number < ammount)) return await interaction.editReply({ content: `**${botConfig.NO} | <@${interaction.user.id}>, Você não tem a quantia fornecida para o pagamento.**` })
}

export function getIntegerOption(interaction: CommandInteraction<CacheType>) {
    let ammount: number = Number(Number(interaction.options.get("ammount")?.value).toFixed(0));
    return ammount;
} 