import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CacheType, Collection, CommandInteraction, ComponentType, EmbedBuilder, Message } from "discord.js";
import { botConfig } from "../app";
import UserController from "../database/controllers/UserController";
import { isVipExpired } from "./DateUtils";
import { IUser } from "../database/models/User";


export const cooldowns = new Collection<String, Boolean>();

export async function checkPayValues(targetUserId: string, optionAmmount: string, interaction: CommandInteraction<CacheType>): Promise<boolean> {

    let mention = await botConfig.mention(interaction.user.id);
    let ammount: number = Number(Number(optionAmmount).toFixed(0));

    let targetUser = await UserController.getUserById(targetUserId);
    let user = await UserController.getUserById(interaction.user.id);

    if (ammount < 20) {
        await interaction.editReply({ content: `**${botConfig.CONFUSED} | ${mention}, Você precisa inserir no mínimo ${botConfig.getCashString(20)}.**` })
        return false;
    }

    if (!targetUser) {
        await interaction.editReply({ content: `**${botConfig.CONFUSED} | <@${targetUserId}>, Tente realizar suas tarefas diárias primeiro.**` });
        return false;
    }
    if (!user) {
        await interaction.editReply({ content: `**${botConfig.CONFUSED} | ${mention}, Tente realizar suas tarefas diárias primeiro.**` });
        return false;
    }

    if (user.userId === targetUser.userId) {
        await interaction.editReply({ content: `**${botConfig.NO} | Você precisa selecionar outro usuário.**` })
        return false;
    }

    if ((user.coins as number < ammount)) {
        await interaction.editReply({ content: `**${botConfig.NO} | ${mention}, Você não tem a quantia fornecida.**` })
        return false;
    }

    return true;
}

export async function checkBetValues(optionAmmount: string, interaction: CommandInteraction<CacheType>): Promise<boolean> {
    let mention = await botConfig.mention(interaction.user.id);

    let ammount: number = getIntegerOption(optionAmmount);
    let max = 100000;
    if (isNaN(ammount)) {
        await interaction.editReply({ content: `**${botConfig.CONFUSED} | ${mention}, Você precisa inserir um valor válido.**` })
        return false;
    }
    if (ammount < 20) {
        await interaction.editReply({ content: `**${botConfig.CONFUSED} | ${mention}, Você precisa inserir no mínimo ${botConfig.getCashString(20)}.**` })
        return false;
    }

    let user = await UserController.getUserById(interaction.user.id);


    if (!user) {
        await interaction.editReply({ content: `**${botConfig.CONFUSED} | ${mention}, Tente realizar suas tarefas diárias primeiro.**` });
        return false;
    }

    if ((user.coins as number < ammount)) {
        await interaction.editReply({ content: `**${botConfig.NO} | ${mention}, Você não tem a quantia fornecida.**` })
        return false;
    }

    return true;
}


export async function checkMaxValues(interaction: CommandInteraction<CacheType>, user: IUser, ammount: number, bet: boolean = false): Promise<boolean> {
    let mention = await botConfig.mention(interaction.user.id);

    let max = 100000;

    if (bet) max = 100000;


    if (ammount > max) {
        await interaction.followUp({ content: `**${botConfig.CONFUSED} | ${mention}, Você só pode usar até** ${botConfig.getCashString(max)}.` });
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

export async function createPagination(response: Message<boolean>, 
    row: ActionRowBuilder<ButtonBuilder>, 
    ...callbacks: Array<(confirmation: ButtonInteraction<CacheType>) => void | Promise<void>>) {

    let collectorFilter = (i: ButtonInteraction) => i.user.id === response.interaction.user.id;
    let collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, filter: collectorFilter, time: 300000 });

    collector.on("collect", async (confirmation) => {

        row.components.forEach(async (_, index: number) => {

            if (confirmation.customId === `${index}`) await callbacks[index](confirmation);

        })

    });

}

export function createNormalButton(label: string, customId: string, disabled: boolean = false): ButtonBuilder {
    return new ButtonBuilder().setLabel(label).setCustomId(customId).setStyle(ButtonStyle.Secondary).setDisabled(disabled);
}

export function createSuccessButton(label: string, customId: string, disabled: boolean = false): ButtonBuilder {
    return createNormalButton(label, customId, disabled).setStyle(ButtonStyle.Success);
}

export function checkDisable(prev: ButtonBuilder, action: ButtonBuilder, next: ButtonBuilder, con1: boolean, con2: boolean, con3: boolean) {
    prev.setDisabled(con1);
    action.setDisabled(con2);
    next.setDisabled(con3);
}

export async function updateConfirmation(interaction: CommandInteraction, confirmation: ButtonInteraction, embed: EmbedBuilder, components: Array<ActionRowBuilder<ButtonBuilder>>, content: string = null, files: Array<Buffer> = null) {
    await interaction.editReply({ content: content ? content : "",components, embeds: embed ? [embed] : [], files: files ? files : [] });
    await confirmation.update({});
}