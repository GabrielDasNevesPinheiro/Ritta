import { Client, TextChannel } from "discord.js";
import { botConfig } from "../app";
import UserController from "../database/controllers/UserController";
import { cooldownCheck, isBoosterExpired, isVipExpired, sortCooldownCheck } from "./DateUtils";
import RaffleManager from "./RaffleManager";


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

        if(array.length == 0) return null;
        
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }

        return array[0];
      }
      


    let sortArray: string[] = [];

    let canSort = sortCooldownCheck(RaffleManager.minutesCooldown, RaffleManager.lastPlayed);

    if(!canSort) return;

    for(let player in RaffleManager.inRaffle) {

        let { tickets } = RaffleManager.inRaffle[player];

        for(let i = 0; i < tickets; i++) {
            sortArray.push(player);
        }
    
    }


    let winnerId = getWinner(sortArray);

    if(!winnerId) {
        RaffleManager.resetGameNoWinner();
        return;
    }
    let tax = 0;
    let user = await UserController.getUserById(winnerId);
    let stats = RaffleManager.getStats();

    if((stats.players >= 2 && stats.price >= 5000) && (isVipExpired(user).allowed && isBoosterExpired(user).allowed)) tax = 1000;

    stats.price -= tax;

    user = await UserController.addCash(user, {
        from: "do sorteio das rifas",
        to: user.userId,
        ammount: stats.price
    });

    let tickets = RaffleManager.inRaffle[String(user.userId)].tickets;

    RaffleManager.resetGame(user, stats.price, tickets);

    try {
        
        await client.users.cache.get(user.userId as string).send(`<@${user.userId}> Parabéns! Você ganhou ${botConfig.getCashString(stats.price)} no sorteio das rifas\n` +
        (tax > 0 ? `> A casa pegou ${botConfig.getCashString(tax)} de taxa.` : "")
        );

        (client.channels.cache.get("1174858045961023559") as TextChannel).send(`${botConfig.GG} | <@${user.userId}> é o gabhador de ${botConfig.getCashString(stats.price)} no sorteio das rifas\n` +
        (tax > 0 ? `> A casa pegou ${botConfig.getCashString(tax)} de taxa.` : ""));
        
    } catch (error) {
    }
}