import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, Client, Colors, ComponentType, EmbedBuilder, InteractionCollector, Message, ModalBuilder, TextChannel, TextInputBuilder, TextInputStyle } from "discord.js";
import { botConfig } from "../app";
import UserController from "../database/controllers/UserController";
import { cooldownCheck, isBoosterExpired, isVipExpired, sleep, sortCooldownCheck } from "./DateUtils";
import RaffleManager from "./RaffleManager";
import { CrashManager } from "./CrashManager";
import { getTax } from "./InteractionUtils";


export async function countVipPassiveCash() {

    let users = await UserController.getAllUsers();

    users.forEach(async (user) => {
        if (!isVipExpired(user).allowed) {
            user.coins = Number(user.coins) + botConfig.vipPassiveEarning;
            await UserController.updateUser(String(user.userId), user);
        }
    });

}

export async function countBoosterPassiveCash() {

    let users = await UserController.getAllUsers();

    users.forEach(async (user) => {
        if (!isBoosterExpired(user).allowed) {
            user.coins = Number(user.coins) + botConfig.boosterPassiveEarning;
            await UserController.updateUser(String(user.userId), user);
        }
    });

}

export async function sortRaffle(client: Client) {

    function getWinner(array: string[]): string | null {

        if (array.length == 0) return null;

        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array[0];
    }



    let sortArray: string[] = [];

    let canSort = sortCooldownCheck(RaffleManager.minutesCooldown, RaffleManager.lastPlayed);

    if (!canSort) return;

    for (let player in RaffleManager.inRaffle) {

        let { tickets } = RaffleManager.inRaffle[player];

        for (let i = 0; i < tickets; i++) {
            sortArray.push(player);
        }

    }


    let winnerId = getWinner(sortArray);

    if (!winnerId) {
        RaffleManager.resetGameNoWinner();
        return;
    }
    let tax = 0;
    let user = await UserController.getUserById(winnerId);
    let stats = RaffleManager.getStats();

    if ((stats.players >= 2 && stats.price >= 5000) && (isVipExpired(user).allowed && isBoosterExpired(user).allowed)) tax = 1000;

    stats.price -= tax;

    user = await UserController.addCash(user, {
        from: "do sorteio das rifas",
        to: user.userId,
        ammount: stats.price
    });

    let tickets = RaffleManager.inRaffle[String(user.userId)].tickets;

    RaffleManager.resetGame(user, stats.price, tickets);

    try {

        await (client.channels.cache.get("1174861456341205012") as TextChannel)?.send(`${botConfig.GG} | <@${user.userId}> é o ganhador de ${botConfig.getCashString(stats.price)} no sorteio das rifas\n` +
            (tax > 0 ? `> A casa pegou ${botConfig.getCashString(tax)} de taxa.` : ""));

        await client.users.cache.get(user.userId as string).send(`<@${user.userId}> Parabéns! Você ganhou ${botConfig.getCashString(stats.price)} no sorteio das rifas\n` +
            (tax > 0 ? `> A casa pegou ${botConfig.getCashString(tax)} de taxa.` : "")
        );

    } catch (error) {

    }
}
export async function startCrash(client: Client) {

    if (CrashManager.running) return;
    CrashManager.running = true;

    let channel = client.channels.cache.get(botConfig.crashChannel) as TextChannel || client.channels.cache.get("1174826007727972433") as TextChannel;

    let message: Message<true> = null;

    let times = Math.floor(Math.random() * (25 - 5 + 1) + 5);
    let multiplier = 1;
    let collector: InteractionCollector<ButtonInteraction<"cached">> = null;

    let button = new ButtonBuilder()
        .setCustomId("join")
        .setLabel("Participar")
        .setStyle(ButtonStyle.Success)

    let buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

    let modal = new ModalBuilder().setCustomId("confirm")
        .setTitle("Defina sua quantia");

    let ammountInput = new TextInputBuilder().setCustomId("ammount")
        .setPlaceholder("Digite aqui a quantia da aposta")
        .setLabel("Faça sua aposta!")
        .setMinLength(3)
        .setRequired(true)
        .setStyle(TextInputStyle.Short);

    let modals = new ActionRowBuilder<TextInputBuilder>().addComponents(ammountInput);

    modal.addComponents(modals);

    let res = await channel.send({
        embeds: [
            new EmbedBuilder().setTitle("Crash Iniciado!").setColor(Colors.Green)
                .setImage(botConfig.IMG_CRASH)], components: [buttonRow]
    });

    let prob = 0.99;
    let buttonCollector = res.createMessageComponentCollector({ componentType: ComponentType.Button });

    buttonCollector.on("collect", async (confirmation) => {
        let players: string[] = [];

        for (let player in CrashManager.inGame) {
            players.push(CrashManager.inGame[player].userId);
        }

        if (players.indexOf(confirmation.user.id) == -1) {

            try {
                await confirmation.showModal(modal);
                let modalRes = await confirmation.awaitModalSubmit({ time: 25000 });
                let ammount = Number(modalRes.fields?.getTextInputValue("ammount"));
                let user = await UserController.getUserById(confirmation.user.id);

                if (RaffleManager.inRaffle[confirmation.user.id]?.tickets < 10 || !RaffleManager.inRaffle[confirmation.user.id]) {

                    await modalRes.deferReply({ ephemeral: true });
                    await modalRes.editReply({ content: `${botConfig.OK} | <@${confirmation.user.id}>, Você precisa ter no mínimo **10 tickets** na rifa atual.` });
                    return;
                } else if (!user) {

                    await modalRes.deferReply({ ephemeral: true });
                    await modalRes.editReply({ content: `${botConfig.OK} | <@${confirmation.user.id}>, Tente realizar suas tarefas primeiro.` });
                    return;
                } else if (user.coins as number < ammount) {

                    await modalRes.deferReply({ ephemeral: true });
                    await modalRes.editReply({ content: `${botConfig.OK} | <@${confirmation.user.id}>, Você não tem a quantia de ${botConfig.getCashString(ammount)}.` });
                    return;
                } else if (!isNaN(ammount) && ammount && ammount <= 100000) {

                    ammount = Math.floor(ammount);

                    if (ammount >= 45000) {
                        prob = 0.25;
                    }

                    CrashManager.inGame[confirmation.user.id] = {
                        bet: ammount,
                        lose: false,
                        stopped: false,
                        userId: confirmation.user.id,
                        username: confirmation.user.username,
                        stoppedMultiplier: 1,

                    }

                    if (!modalRes.replied)
                        await modalRes.deferReply({ ephemeral: true });

                    await modalRes.editReply({ content: `${botConfig.OK} | <@${confirmation.user.id}>, Você está no crash apostando ${botConfig.getCashString(ammount)}.` });

                    return;

                } else if (ammount > 100000) {

                    if (!modalRes.replied)
                        await modalRes.deferReply({ ephemeral: true });

                    await modalRes.editReply({ content: `${botConfig.OK} | <@${confirmation.user.id}>, Você só pode apostar até ${botConfig.getCashString(100000)}.` });
                    buttonCollector.stop();
                    return;

                } else {
                    if (!modalRes.replied)
                        await modalRes.deferReply({ ephemeral: true });

                    await modalRes.editReply({ content: `${botConfig.NO} | <@${confirmation.user.id}>, Você precisa inserir um valor válido.` });
                    buttonCollector.stop();
                    return;
                }

            } catch (error) {
                
            }


        }


    });

    await sleep(15000);
    await res.delete();

    let drawButton = new ButtonBuilder()
        .setLabel("Retirar")
        .setCustomId("draw")
        .setStyle(ButtonStyle.Secondary)

    let drawRow = new ActionRowBuilder<ButtonBuilder>().addComponents(drawButton);

    for (let i = 0; i <= times; i++) {

        let multiplierSum = 0;

        if (Math.random() > prob) {
            multiplierSum = Math.random() * 0.05;
        } else {
            multiplierSum = Math.random() * 0.42;
        }


        multiplier += multiplierSum;


        let final = i == times;
        let draw = "";
        let stacking = "";


        for (let player in CrashManager.inGame) {

            if (!CrashManager.inGame[player].stopped) stacking += `🔴 ${CrashManager.inGame[player].username}: ${botConfig.getCashString(Math.floor(CrashManager.inGame[player].bet * multiplier))}`;
            if (CrashManager.inGame[player].stopped) draw += `🟢 ${CrashManager.inGame[player].username}: ${botConfig.getCashString(Math.floor(CrashManager.inGame[player].bet * CrashManager.inGame[player].stoppedMultiplier))}`;
        }

        let crashstring = getEmojiString(Math.floor(multiplier), final)

        let embed = !final ?
            new EmbedBuilder().setTitle(`🚀 Multiplicador: ${multiplier.toFixed(2)}x`)
                .setDescription(`**Retiraram:**\n${draw === "" ? "Nenhum." : draw}\n\n**Ainda no Jogo:**\n${stacking === "" ? "Nenhum." : stacking}\n\n${crashstring}\n`).setColor(Colors.Green)
            :
            new EmbedBuilder().setTitle(`${botConfig.STONKS} Multiplicador Final: ${multiplier.toFixed(2)}x`)
                .setDescription(`**Retiraram:\n**${draw === "" ? "Nenhum." : draw}\n\n**Perderam:**\n${stacking === "" ? "Nenhum." : stacking}\n\n${crashstring}\n\n` + `🔥 Fim de Jogo: Em breve outro irá iniciar.`).setColor(Colors.Green)
                .setColor(Colors.Red)

        if (!message) {
            message = await channel.send({ embeds: [embed], components: [drawRow] });

            collector = message.createMessageComponentCollector({ componentType: ComponentType.Button });

            collector.on("collect", async (confirmation) => {

                if (CrashManager.inGame[confirmation.user.id]) {

                    if (!CrashManager.inGame[confirmation.user.id].stopped) {
                        CrashManager.inGame[confirmation.user.id].stopped = true;
                        CrashManager.inGame[confirmation.user.id].stoppedMultiplier = multiplier;
                        confirmation.update({});
                    }

                }
            });


        }

        if (message) await message.edit({ embeds: [embed], components: final ? [] : [drawRow] });

        await sleep(1000);
    }

    for (let player in CrashManager.inGame) {

        let user = await UserController.getUserById(player);

        if (CrashManager.inGame[player].stopped) {
            let tax = getTax(Math.floor(CrashManager.inGame[player].bet * CrashManager.inGame[player].stoppedMultiplier));

            if (!isVipExpired(user).allowed) tax = 0;

            await UserController.addCash(user, {
                from: "apostando no crash",
                to: user.userId,
                ammount: Math.floor(((CrashManager.inGame[player].bet * CrashManager.inGame[player].stoppedMultiplier) - tax) - CrashManager.inGame[player].bet)
            });

        } else {

            await UserController.removeCash(user, {
                from: user.userId,
                to: "apostando no crash",
                ammount: CrashManager.inGame[player].bet
            });

        }

    }
    collector.stop();
    CrashManager.inGame = {};
    CrashManager.running = false;




}

function getEmojiString(numeroAtual: number, vermelho: boolean): string {
    const emojiVermelho = '💥';
    const emojiVerde = '🚀';
    const minimoExibicao = 5;

    let resultado = '';

    for (let i = Math.max(numeroAtual, minimoExibicao); i > Math.max(numeroAtual - minimoExibicao, 0); i--) {
        if (i == numeroAtual) {
            if (vermelho) {
                if (i == numeroAtual) resultado += `${i}x  ${emojiVermelho}\n`;
            }
            if (!vermelho)
                resultado += `${i}x  ${emojiVerde}\n`;

        } else {
            resultado += `${i}x\n`;
        }
    }

    return resultado.trim();
}
