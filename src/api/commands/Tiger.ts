import { CommandInteraction, CacheType, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { botConfig } from "../../app";
import { checkBetValues, getIntegerOption } from "../../util/InteractionUtils";
import UserController from "../../database/controllers/UserController";


export abstract class Tiger extends Command {
    
    
    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("tiger")
        .addStringOption(option => 
            option.setName("ammount")
            .setDescription("Quantidade a ser apostada")
            .setRequired(true)
            .setMinLength(2)
            ).setDescription("Aposte no tigrinho")
    
    static async execute(interaction: CommandInteraction<CacheType>) {
        
        await interaction.deferReply();
        
        let ammount: number = getIntegerOption(interaction.options.get("ammount")?.value as string);

        if (isNaN(ammount)) return await interaction.editReply({ content: `**${botConfig.CONFUSED} | <@${interaction.user.id}>, Você precisa inserir um valor válido.**` })
        if (ammount < 20) return await interaction.editReply({ content: `**${botConfig.CONFUSED} | <@${interaction.user.id}>, Você precisa inserir no mínimo ${botConfig.getCashString(20)}.**` })

        let user = await UserController.getUserById(interaction.user.id);

        let res = await checkBetValues(String(ammount), interaction);

        if(!res) return;

        await interaction.editReply({ content: "Tudo certo" });

    }

}



















type Matrix = number[][];

function countRepeatedItems(matrix: Matrix): Map<number, number> {
    const countMap: Map<number, number> = new Map();

    // Verificação horizontal
    for (let row = 0; row < 3; row++) {
        const rowValues = matrix[row];
        countValues(rowValues, countMap);
    }

    // Verificação vertical
    for (let col = 0; col < 3; col++) {
        const colValues = [matrix[0][col], matrix[1][col], matrix[2][col]];
        countValues(colValues, countMap);
    }

    // Verificação diagonal principal
    const diagonalValues = [matrix[0][0], matrix[1][1], matrix[2][2]];
    countValues(diagonalValues, countMap);

    // Verificação diagonal secundária
    const secDiagonalValues = [matrix[0][2], matrix[1][1], matrix[2][0]];
    countValues(secDiagonalValues, countMap);

    return countMap;
}


function countValues(values: number[], countMap: Map<number, number>): void {
    const uniqueValues = new Set(values);
    uniqueValues.forEach((value) => {
        if (value !== 0 && values.filter((v) => v === value).length >= 3) {
            const currentCount = countMap.get(value) || 0;
            countMap.set(value, currentCount + 1);
        }
    });
}

function getRandomMatrix() {
    let r1 = [3, 3, 3].map((n) => Math.floor(Math.random() * n));
    let r2 = [3, 3, 3].map((n) => Math.floor(Math.random() * n));
    let r3 = [3, 3, 3].map((n) => Math.floor(Math.random() * n));

    const exampleMatrix: Matrix = [
        r1,
        r2,
        r3
    ];

    return exampleMatrix;
}

function getTotalMultiplier(repeatedItemsCount: Map<number, number>) {
    let multipliers: {[key: number]: number} = {
        0: 1,
        1: 2,
        2: 3,
    };
    
    let multiplier = 0;

    repeatedItemsCount.forEach((times, num) => {
        multiplier += multipliers[num] * times;
    });

    return multiplier;
}