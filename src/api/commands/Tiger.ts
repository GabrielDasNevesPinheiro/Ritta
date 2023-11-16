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

        let tigerArray = generateRandomArray();
        tigerArray = decreaseProbability(tigerArray);
        let multiplier = getTotalMultiplier(countRepeatedItems(tigerArray));

        await interaction.editReply({ content: `Tua array: ${tigerArray}, (${multiplier}x vezes) com isso você deve ganhar ${ammount * multiplier}` });

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

function generateRandomArray(): number[][] {
    const matrix: number[][] = [];
    const possibleValues = [0, 1, 2];

    for (let i = 0; i < 3; i++) {
        matrix[i] = [];
        for (let j = 0; j < 3; j++) {
            matrix[i][j] = possibleValues[Math.floor(Math.random() * possibleValues.length)];
        }
    }

    return matrix;
}

function decreaseProbability(matrix: number[][]): number[][] {
    const occurrences: Map<string, number> = new Map();

    // Contagem das sequências horizontais
    for (let i = 0; i < 3; i++) {
        const row = matrix[i].join('');
        occurrences.set(row, (occurrences.get(row) || 0) + 1);
    }

    // Contagem das sequências verticais
    for (let j = 0; j < 3; j++) {
        const col = matrix.map(row => row[j]).join('');
        occurrences.set(col, (occurrences.get(col) || 0) + 1);
    }

    // Contagem da diagonal principal
    const diagonal1 = matrix[0][0].toString() + matrix[1][1] + matrix[2][2];
    occurrences.set(diagonal1, (occurrences.get(diagonal1) || 0) + 1);

    // Contagem da diagonal secundária
    const diagonal2 = matrix[0][2].toString() + matrix[1][1] + matrix[2][0];
    occurrences.set(diagonal2, (occurrences.get(diagonal2) || 0) + 1);

    // Reduzindo a probabilidade de ocorrência das sequências encontradas
    for (const [key, value] of occurrences.entries()) {
        const probability = Math.max(0.1, 1 - (value * 0.1)); // Reduzindo a probabilidade
        occurrences.set(key, probability);
    }

    // Gerando uma nova matriz com base nas probabilidades
    const newMatrix: number[][] = [];
    let possibleValues = [0,1,2];
    for (let i = 0; i < 3; i++) {
        newMatrix[i] = [];
        for (let j = 0; j < 3; j++) {
            let newValue = possibleValues[Math.floor(Math.random() * possibleValues.length)];
            const currentSequence = matrix.map(row => row.join('')).join('');
            const probability = occurrences.get(currentSequence) || 1;

            // Se a probabilidade for menor que um valor aleatório, mantenha o valor atual
            if (Math.random() < probability) {
                newValue = matrix[i][j];
            }

            newMatrix[i][j] = newValue;
        }
    }

    return newMatrix;
}