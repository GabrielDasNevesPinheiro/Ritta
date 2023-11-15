import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, ComponentType, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { botConfig } from "../../app";
import { CanvasRenderingContext2D, createCanvas, loadImage } from "canvas";
import { getDouble } from "../../util/ImageUtils";
import UserController from "../../database/controllers/UserController";
import { isVipExpired } from "../../util/DateUtils";

export default class Double extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("double")
        .addStringOption(option =>
            option.setName("ammount")
                .setDescription("Quantidade a ser usada na aposta")
                .setRequired(true)
        ).setDescription("Aposte no double");

    static async execute(interaction: CommandInteraction) {

        await interaction.deferReply();

        let bet: number = Number(interaction.options.get("ammount")?.value || "a");

        if (isNaN(bet)) {
            return await interaction.editReply({ content: `${botConfig.CONFUSED} | <@${interaction.user.id}>, por favor insira um valor válido para a aposta.` });
        }

        let user = await UserController.getUserById(interaction.user.id);

        if (!user) {
            return await interaction.editReply({ content: `${botConfig.SAD} Ocorreu um erro interno, tente novamente.` });
        }
        
        if(user.coins as number < bet) {
            return await interaction.editReply({ content: `${botConfig.CONFUSED} Parece que você não tem **${botConfig.cashname}** o suficiente para essa aposta.`});
        }

        let redProb = 0.46;
        let blackProb = 0.96;
        let cores = ["red", "black", "white"];
        let random = Math.random();
        let sorted = "";
        let tax = 300;

        let normalMultiplier = 2;
        let rareMultiplier = 14;
        let selectedMultiplier = 0;

        let alreadyPlayed = false;


        if (!isVipExpired(user)) {
            redProb = 0.32;
            blackProb = 0.64;
            tax = 0;
        }

        
        let red = new ButtonBuilder()
            .setLabel("Red (2x)")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("red")
            .setEmoji(`${botConfig.CASH}`);

        let black = new ButtonBuilder()
            .setLabel("Black (2x)")
            .setStyle(ButtonStyle.Secondary)
            .setCustomId("black")
            .setEmoji(`${botConfig.CASH}`)

        let white = new ButtonBuilder()
            .setLabel("White (14x)")
            .setStyle(ButtonStyle.Success)
            .setCustomId("white")
            .setEmoji(`${botConfig.CASH}`)

        let row = new ActionRowBuilder<ButtonBuilder>().addComponents([red, black, white]);

        let response = await interaction.editReply({ content: `${botConfig.MONEY} Você vai apostar ${botConfig.getCashString(bet)} no Double. Escolha uma cor:`, components: [row] });

        const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 15000 });

        collector.on('collect', async(confirmation) => {

            let betColor  = confirmation.customId as "red" | "black" | "white";

            if (random < redProb) {
                sorted = cores[0];
                selectedMultiplier = normalMultiplier;
            } else if (random < blackProb) {
                sorted = cores[1];
                selectedMultiplier = normalMultiplier;
            } else {
                sorted = cores[2];
                selectedMultiplier = rareMultiplier;
            }
    
            let ammount = bet;
            ammount *= selectedMultiplier;
            ammount -= bet >= 1000 ? tax : 0;
    
            const doubleResult = await getDouble(sorted);
            if (sorted !== betColor) {
    
                user = await UserController.removeCash(user, {
                    from: user.userId,
                    to: "para o double",
                    ammount: bet
                });
    
                await confirmation.update({
                    content:
                        `> ${botConfig.NO_STONKS} | <@${interaction.user.id}>, Você apostou no __${betColor}__ e o jogo sorteou __${sorted}__. Você perdeu ${botConfig.getCashString(bet)}!`,
                    files: [doubleResult],
                    components: []
                });
                alreadyPlayed = true;
                return;
            }
            
            

            user = await UserController.addCash(user, {
                from: "do double",
                to: user.userId,
                ammount: ammount
            })
    
            await confirmation.update({
                content:
                    `> ${botConfig.STONKS} | <@${interaction.user.id}>, Você apostou no __${betColor}__ e o jogo sorteou __${sorted}__. Você ganhou ${botConfig.getCashString(ammount)} **(${bet}x${selectedMultiplier})!**\n` + (bet >= 1000 ? `${botConfig.getCashString(tax)} de taxa.` : ""),
                files: [doubleResult],
                components: []
            });
            alreadyPlayed = true;
            return;
        });

        collector.on("end", async(confirmation) => {
            if(!alreadyPlayed)
                await interaction.editReply({ content: `${botConfig.WAITING} O tempo para escolha acabou.`, components: []});
        })

    }

}