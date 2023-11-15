import { IUser } from "../database/models/User";
import { cooldownCheck } from "./DateUtils";

export default abstract class RaffleManager {

    static cooldown = 0.5;
    static lastPlayed = new Date();
    static lastWinner: IUser = { userId: "340933138039439360" };
    static lastWinnerWon = 50000;
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
}