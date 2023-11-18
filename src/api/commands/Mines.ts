import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CacheType, Colors, CommandInteraction, ComponentType, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { checkBetValues, checkMaxValues, getTax } from '../../util/InteractionUtils';
import UserController from "../../database/controllers/UserController";
import { getMinesMatrix } from "../../util/MatrixUtils";
import { botConfig } from "../../app";
import { isVipExpired } from "../../util/DateUtils";


export default abstract class Mines extends Command {
    
    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("mines")
        .addIntegerOption(option => 
            option.setName("ammount")
            .setDescription("Quantidade da aposta")
            .setRequired(true)
            .setMinValue(100)    
        )
        .addIntegerOption(option => 
            option.setName("bombs")
            .setDescription("Quantidade de bombas")    
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(19)
        ).setDescription("Jogue no campo minado");
    
    
    static async execute(interaction: CommandInteraction<CacheType>) {
        
        await interaction.deferReply({});
        let ammount = interaction.options.get("ammount").value as number;
        let bombs = interaction.options.get("bombs").value as number;

        let res = await checkBetValues(String(ammount), interaction);

        let user = await UserController.getUserById(interaction.user.id);
        let canBet = await checkMaxValues(interaction, user, ammount);

        if(!res) return;
        if(!canBet) return;

        let bombsArray = getMinesMatrix(bombs);
        let rows = getMinesButtons(bombsArray);
        let clicked: string[] = [];
        let multiplier = 1;
        let embed = getGameEmbed(bombs, (20 - bombs) - clicked.length, ammount, multiplier);
        let diamondsLeft = (20 - bombs) - clicked.length;
        let tax = getTax(ammount);

        if(!isVipExpired(user).allowed) {
            tax = 0;
        }
        
        let confirm = new ButtonBuilder()
            .setLabel("Retirar")
            .setCustomId("draw")
            .setStyle(ButtonStyle.Success);

        let confirmRow = new ActionRowBuilder<ButtonBuilder>().addComponents(confirm);
        rows.push(confirmRow);
        

        let response = await interaction.editReply({ content: ``, components: rows, embeds: [embed] });
        const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button });

        collector.on("collect", async (confirmation) => {

            let row = Number(confirmation.customId.split(".")[0]);
            let item = Number(confirmation.customId.split(".")[1]);

            if(confirmation.user.id !== interaction.user.id) return;

            if(confirmation.customId === "draw") {

                if(diamondsLeft == (20 - bombs)) {
                    await interaction.editReply({ content: `**${botConfig.OK} | <@${user.userId}>**, Como você não achou nenhum diamante, o jogo foi anulado.`, components: [], embeds: [] });
                    collector.emit("end");
                    return;
                }

                let count = Math.floor(ammount * multiplier) - tax;
                user = await UserController.addCash(user, {
                    from: "jogando mines",
                    to: user.userId,
                    ammount: count - ammount
                });

                await interaction.editReply({ content: `**${botConfig.OK} | <@${user.userId}>**, Você ganhou um total de ${botConfig.getCashString(count)}.\n` +
                (tax > 0 ? `${botConfig.getCashString(tax)} de taxa.` : ``), components: [] });
                collector.emit("end");
                return;

            }

            if(clicked.indexOf(confirmation.customId) != -1) {
                await confirmation.update({ components: rows, embeds: [embed] });
                return;
            };
            
            clicked.push(confirmation.customId);

            if(bombsArray[row][item]) {
                rows = getMinesButtons(bombsArray, true);

                user = await UserController.removeCash(user, {
                    from: user.userId,
                    to: "jogando mines",
                    ammount
                });

                await confirmation.update({ content: `**${botConfig.OK} | <@${user.userId}>**, Você perdeu um total de ${botConfig.getCashString(ammount)}`, components: rows });
                collector.emit("end");
                return;
            }

            rows = getMinesButtons(bombsArray, false, clicked);
            rows.push(confirmRow);
            multiplier += getMultiplier(bombs);
            diamondsLeft = (20 - bombs) - clicked.length;
            embed = getGameEmbed(bombs, diamondsLeft, ammount, multiplier);

            await confirmation.update({ embeds: [embed], components: rows });

            if(diamondsLeft == 0) {
                let count = Math.floor(ammount * multiplier);
                user = await UserController.addCash(user, {
                    from: "jogando mines",
                    to: user.userId,
                    ammount: count - ammount
                });

                await interaction.editReply({ content: `**${botConfig.OK} | <@${user.userId}>**, Você ganhou um total de ${botConfig.getCashString(count)}.\n` +
                (tax > 0 ? `${botConfig.getCashString(tax)} de taxa.` : ``), components: [] });
                collector.emit("end");
            }

            
        });

        collector.on("end", () => {
            collector.stop();
        })

    }
}

function getMultiplier(bombas: number) {

    const maxBombas = 19;
    const minBombas = 1;

    const bombasLimitadas = Math.min(Math.max(bombas, minBombas), maxBombas); // Limita entre 1 e 20 bombas

    if (bombas >= 19) return 6.3;
    if (bombas > 15) return 1.2;
    if (bombas > 13) return 0.7;
    if (bombas > 10) return 0.5;
    if (bombas > 5) return 0.2;
    if (bombas >= 2) return 0.04;
    if (bombas < 2) return 0.02;
}

function getGameEmbed(bombCount: number, remainingDiamonds: number, bet: number, multiplier: number,) {
    
    let value = Math.floor(bet * multiplier);

    return new EmbedBuilder().setTitle("Mines Game")
    .setDescription(
        `💣 Bombas no Campo: ${bombCount}\n`+
        `💎 Diamantes no Campo: ${20 - bombCount}\n` +
        `💎 Diamantes restantes: ${remainingDiamonds}\n` +
        `💰 Dinheiro apostado: ${botConfig.getCashString(bet)}\n` +
        `🏦 Valor retirável: ${botConfig.getCashString(value)}\n` +
        `📈 Multiplicador atual: ${multiplier.toFixed(2)}x\n` 
        
    ).setColor(Colors.Blue)
}

type Index = {
    row: number,
    col: number
}

function getMinesButtons(array: boolean[][], show: boolean = false, clicked: string[] = []) {
    let rows: ActionRowBuilder<ButtonBuilder>[] = [];

        for (let row of array) {

            let actionrow = new ActionRowBuilder<ButtonBuilder>();

            row.forEach( (item, index) => {

                let emoji = !show ? `⬛`: (item ? `💥` : `💎`);
                let style = !show ? ButtonStyle.Secondary : (item ? ButtonStyle.Danger : ButtonStyle.Success);
                let customId = String(array.indexOf(row) +"."+ String(index));

                if(clicked.indexOf(customId) != -1) {
                        emoji = item ? `💥` : `💎`;
                        style = item ? ButtonStyle.Danger : ButtonStyle.Success;
                }

                let bt = new ButtonBuilder()
                    .setCustomId(customId)
                    .setLabel(emoji)
                    .setStyle(style);
                    actionrow.addComponents(bt);
            });

            rows.push(actionrow);

        }

        return rows;
}