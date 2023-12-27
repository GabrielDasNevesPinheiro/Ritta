import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, CacheType, Colors, CommandInteraction, ComponentType, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import UserController from "../../database/controllers/UserController";
import { botConfig } from "../../app";
import { calcScratchPrize, getScratch } from "../../util/MatrixUtils";
import { getTax } from "../../util/InteractionUtils";
import { isVipExpired } from "../../util/DateUtils";


export default abstract class Scratch extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("scratch").setDescription("Jogue a raspadinha")


    static async execute(interaction: CommandInteraction<CacheType>) {
        await interaction.deferReply({});
        let mention = await botConfig.mention(interaction.user.id);
        let user = await UserController.getUserById(interaction.user.id);

        if (!user) return await interaction.editReply({ content: `${botConfig.CONFUSED} | ${mention}, Tente realizar suas tarefas primeiro.` });
        if (Number(user.coins) < 500) return await interaction.editReply({ content: `${botConfig.CONFUSED} | ${mention}, Você precisa ter no mínimo ${botConfig.getCashString(2000)} para comprar a raspadinha.` });

        let game = getScratch();
        let calc = calcScratchPrize(game);
        let tax = getTax(calc);

        if (!isVipExpired(user).allowed) tax = 0;

        user = await UserController.removeCash(user, {
            from: user.userId,
            to: "comprando uma raspadinha",
            ammount: 2000
        });

        let gameStr = "";
        for (let row of game) {

            for (let text of row) {
                gameStr += `||${text}|| `;
            }
            gameStr += `\n`;
        }

        let draw = new ButtonBuilder().setLabel("Retirar").setStyle(ButtonStyle.Success).setCustomId("draw");
        let info = new ButtonBuilder().setLabel("Info").setStyle(ButtonStyle.Secondary).setCustomId("info");
        let row = new ActionRowBuilder<ButtonBuilder>().addComponents(draw, info);

        let res = await interaction.editReply({ content: `${botConfig.GG} Aqui está sua raspadinha! Basta clicar nos spoilers para revelar o resultado.\n**Se você clicar em __Retirar__ sem sequências você será penalizado** em ${botConfig.getCashString(2500)}\nClique em __Info__ para saber mais.\n${gameStr}`, components: [row] });

        const collector = res.createMessageComponentCollector({ componentType: ComponentType.Button, time: 25000 });


        collector.on("collect", async (confirmation) => {

            await confirmation.update({});

            if (confirmation.user.id !== interaction.user.id) return;

            if (confirmation.customId === "draw") {
                if (calc == 0) {

                    user = await UserController.removeCash(user, {
                        from: user.userId,
                        to: "jogando raspadinha",
                        ammount: 2500
                    });
                    await interaction.followUp({ content: `${botConfig.NO_STONKS} | ${mention}, Você foi penalizado em ${botConfig.getCashString(2500)}.` })
                    collector.stop();
                    return;

                } else {

                    user = await UserController.addCash(user, {
                        from: "jogando raspadinha",
                        to: user.userId,
                        ammount: calc - tax
                    });
                    await interaction.editReply({
                        content: `${botConfig.STONKS} | ${mention}, Você retirou ${botConfig.getCashString(calc)}.\n` +
                            (tax > 0) ? `${botConfig.getCashString(tax)} de taxa.` : ``
                    });
                    collector.stop();
                    return;


                }
            } else {

                await interaction.followUp({
                    ephemeral: true, content: `${botConfig.CASH} Tabela de Prêmios da Raspadinha ${botConfig.CASH}\n\n` +
                        `🎁 - ${botConfig.getCashString(80000)}\n` +
                        `🍌 - ${botConfig.getCashString(50000)}\n` +
                        `😱 - ${botConfig.getCashString(8000)}\n` +
                        `❤️ - ${botConfig.getCashString(3000)}\n` +
                        `💀 - ${botConfig.getCashString(500)}\n\n` +
                        `**Você ganha caso haja pelo menos uma sequência de 3 emojis iguais na horizontal, vertical ou nas diagonais.**`
                });
                return;

            }

        })
    }
}