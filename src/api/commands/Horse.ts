import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CacheType, ColorResolvable, Colors, CommandInteraction, ComponentType, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { checkBetValues, checkMaxValues, getTax } from "../../util/InteractionUtils";
import UserController from "../../database/controllers/UserController";
import { botConfig } from "../../app";
import { isVipExpired, sleep } from "../../util/DateUtils";

export default abstract class Horse extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("horse")
        .addIntegerOption(option =>
            option.setName("ammount")
                .setDescription("Quantidade da aposta")
                .setRequired(true)
                .setMinValue(100)
        )
        .setDescription("Aposte na corrida de cavalos")

    static async execute(interaction: CommandInteraction<CacheType>) {

        await interaction.deferReply({});

        let ammount = interaction.options.get("ammount").value as number;
        let res = await checkBetValues(String(ammount), interaction);

        if (!res) return;

        let user = await UserController.getUserById(interaction.user.id);
        let canBet = await checkMaxValues(interaction, user, ammount);

        if (!canBet) return;

        let tax = getTax(ammount);

        if (!isVipExpired(user).allowed) tax = 0;


        let race: HorseType[] = [
            { emoji: "🟨", name: "Amarelo", distance: 0, embedColor: Colors.Yellow },
            { emoji: "🟪", name: "Roxo", distance: 0, embedColor: Colors.Purple },
            { emoji: "🟦", name: "Azul", distance: 0, embedColor: Colors.Blue },
            { emoji: "⬜", name: "Branco", distance: 0, embedColor: Colors.White },
            { emoji: "🟥", name: "Vermelho", distance: 0, embedColor: Colors.Red }
        ];

        let row: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder();

        race.forEach((horse) => {
            row.addComponents(new ButtonBuilder()
                .setLabel(horse.name)
                .setCustomId(horse.name)
                .setStyle(ButtonStyle.Secondary)
            );
        });

        let response = await interaction.editReply({
            content: `${botConfig.HORSE} | <@${user.userId}>, Escolha uma **cor** de cavalo para te **representar** nessa corrida!\n**Esta corrida está valendo** ${botConfig.getCashString(ammount)}.`,
            components: [row]
        });

        let collector = response.createMessageComponentCollector({ componentType: ComponentType.Button });

        collector.on("collect", async (confirmation) => {
            if (confirmation.user.id !== user.userId) return;

            await interaction.editReply({ content: `${botConfig.OK} | <@${user.userId}>, Você escolheu **${confirmation.customId}** para te representar na corrida valendo${botConfig.getCashString(ammount)}.`})

            for (let i = 0; i < 5; i++) {

                let text = "";


                race.sort((prev, next) => prev.distance < next.distance ? 1 : -1);
                race.forEach((horse, index) => {
                    if (!(i == 5 - 1))
                        horse.distance += Math.random() * 3.5;
                    text += `${horse.emoji} ${'‎ ‎ ‎ ‎'.repeat(horse.distance)} ${botConfig.HORSE} (${horse.distance.toFixed(2)})\n`
                });

                let embed = new EmbedBuilder().setDescription(text).setColor(race[0].embedColor);

                await interaction.editReply({ embeds: [embed], components: [] });
                await sleep(500);

            }

            let winner = getWinner(race);
            let selected = race.find((horse) => horse.name === confirmation.customId ? horse : null);

            if (winner.name === selected.name) {
                ammount *= 2;
                if (tax > 0) ammount -= getTax(ammount);

                user = await UserController.addCash(user, {
                    from: "apostando em cavalos",
                    to: user.userId,
                    ammount: Math.floor(ammount)
                });

                await interaction.followUp({
                    content: `**${botConfig.STONKS} | <@${user.userId}>**, O Cavalo **${winner.name}** se saiu vitorioso e você ganhou ${botConfig.getCashString(Math.floor(ammount))}. \n` +
                        (tax > 0 ? `${botConfig.getCashString(tax)} de taxa.` : ``)
                })

            } else {
 
                user = await UserController.removeCash(user, {
                    from: user.userId,
                    to: "apostando em cavalos",
                    ammount: ammount
                })
                await interaction.followUp({ content: `**${botConfig.STONKS} | <@${user.userId}>**, O Cavalo **${winner.name}** se saiu vitorioso e você perdeu ${botConfig.getCashString(ammount)}.` });
            }
            collector.stop();

        });



    }
}

type HorseType = {
    emoji: string
    name: string
    distance: number
    embedColor: ColorResolvable
}

function getWinner(horses: HorseType[]) {
    if (horses.length === 0) {
        return null;
    }

    let maxDistanceHorse: HorseType = horses[0];

    for (let i = 1; i < horses.length; i++) {
        if (horses[i].distance > maxDistanceHorse.distance) {
            maxDistanceHorse = horses[i];
        }
    }

    return maxDistanceHorse;
}