import { CacheType, Colors, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { loadImage } from "canvas";
import { botConfig } from "../../app";
import { getRouletteResult } from "../../util/ImageUtils";
import { isVipExpired, sleep } from "../../util/DateUtils";
import UserController from "../../database/controllers/UserController";
import { getTax } from "../../util/InteractionUtils";


export default abstract class Roulette extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("roulette")
        .setDescription("Gire a roleta para ganhar recompensas")

    static async execute(interaction: CommandInteraction<CacheType>) {

        await interaction.deferReply({});
        let result = sortRoulette();
        let image = await getRouletteResult(result);

        let user = await UserController.getUserById(interaction.user.id);

        if(!user) return await interaction.editReply({ content: `${botConfig.CONFUSED} | <@${interaction.user.id}>, Tente realizar suas tarefas primeiro.` });
        if(user.coins as number < 1500) return await interaction.editReply({ content: `${botConfig.CONFUSED} | <@${interaction.user.id}>, Você precisa ter no mínimo ${botConfig.getCashString(1500)}.` });

        user = await UserController.removeCash(user, {
            from: user.userId,
            to: "jogando roleta",
            ammount: 1500
        });

        await interaction.editReply({ embeds: [
            new EmbedBuilder().setTitle(`${botConfig.GG} Boa sorte Jogador!`).setImage(botConfig.GIF_ROULETTE).setColor(Colors.Red)
        ], content: `<@${user.userId}>, Você pagou ${botConfig.getCashString(1500)}.` });

        await sleep(2800);

        let messages = {
            "Perdeu": `${botConfig.CRYING} | <@${interaction.user.id}>, Infelizmente você perdeu.`,
            "1k": `${botConfig.STONKS} | <@${interaction.user.id}>, Você ganhou a recompensa de `,
            "5k": `${botConfig.STONKS} | <@${interaction.user.id}>, Você ganhou a recompensa de `,
            "9k": `${botConfig.STONKS} | <@${interaction.user.id}>, Você ganhou a recompensa de `,
            "15k": `${botConfig.STONKS} | <@${interaction.user.id}>, Você ganhou a recompensa de `,
            "VIP": `${botConfig.GG} | <@${interaction.user.id}>, Você ganhou um __VIP__.`,
        }

        let prices = {
            "Perdeu": 0,
            "1k": 1000,
            "5k": 5000,
            "9k": 9000,
            "15k": 15000,
        }
        let ammount = prices[result] | 0;
        let tax = getTax(ammount);
        if(!isVipExpired(user).allowed) tax = 0;
        let adittional = "";

        if(result === "VIP") {
            user.vipDate = new Date();
            user = await UserController.updateUser(user.userId as string, user);
        } else if(result === "Perdeu") {
            await interaction.editReply({ content: messages[result], embeds: [], files: [image] });
            return;
        } else {
            
            if(tax > 0)
                tax = getTax(prices[result]);

                ammount = Math.floor(prices[result] - tax);

            messages[result] += botConfig.getCashString(ammount) + ".";

            user = await UserController.addCash(user, {
                from: "jogando na roleta",
                to: user.userId,
                ammount
            });

            adittional = (tax > 0) ? `${botConfig.getCashString(tax)} de taxa.` : ``;
        }
        
        
        await interaction.editReply({ content: messages[result]+"\n"+adittional, embeds: [], files: [image] });

    }

}


const roletaItens = [
    { item: 'Perdeu', probabilidade: 0.5 },      // 50% de chance
    { item: '1k', probabilidade: 0.25 },         // 25% de chance
    { item: '5k', probabilidade: 0.15 },         // 15% de chance
    { item: '9k', probabilidade: 0.0999999999 }, // 9.99999999% de chance
    { item: '15k', probabilidade: 0.0000000099 },// 0.0000000099% de chance
    { item: 'VIP', probabilidade: 0.0000000001 },// 0.0000000001% de chance
];

function sortRoulette(): string {
    const randomNumber = Math.random();

    let cumulativeProbability = 0;


    for (const roletaItem of roletaItens) {
        cumulativeProbability += roletaItem.probabilidade;

        if (randomNumber <= cumulativeProbability) {
            return roletaItem.item;
        }
    }

    return 'Perdeu';
}