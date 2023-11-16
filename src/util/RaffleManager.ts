import { IUser } from "../database/models/User";
import { cooldownCheck } from "./DateUtils";

export default abstract class RaffleManager {

    static cooldown = 0.02;
    static minutesCooldown = 1;
    static lastPlayed = new Date();
    static lastWinner: IUser = null;
    static lastWinnerWon = 0;
    static lastWinnerTickets = 0;
    static rafflePrice = 500;

    static inRaffle: {[key: string]: {
        tickets: number
    }} = {};

    static getStats() {

        let price = 0;
        let tickets = 0;
        let players = 0;
        let endTime = cooldownCheck(RaffleManager.cooldown, RaffleManager.lastPlayed).time;

        for (let player in RaffleManager.inRaffle) {
            tickets += RaffleManager.inRaffle[player].tickets;
            price += RaffleManager.inRaffle[player].tickets * RaffleManager.rafflePrice;
            players += 1;
        }

        return {
            "price": price,
            "tickets": tickets,
            "players": players,
            "endTime": endTime,
        }
    }

    static addPlayer(userId: string, tickets: number) {
        
        if(!RaffleManager.inRaffle[userId]) {

            RaffleManager.inRaffle[userId]= { tickets };
        } else {
            RaffleManager.inRaffle[userId].tickets += tickets;
        }
    }

    static resetGame(winner: IUser, won: number, tickets: number) {
        RaffleManager.lastPlayed = new Date();
        RaffleManager.lastWinner = winner;
        RaffleManager.lastWinnerWon = won;
        RaffleManager.lastWinnerTickets = tickets;

        for(let player in RaffleManager.inRaffle) {
            delete RaffleManager.inRaffle[player];
        }
    }

    static resetGameNoWinner() {
        RaffleManager.lastPlayed = new Date();
    }
}