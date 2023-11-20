import { CacheType, CommandInteraction, Interaction } from "discord.js";
import Command from "../api/commands/Command";
import EditUser from "../api/commands/EditUser";
import Say from "../api/commands/Say";
import Daily from "../api/commands/Daily";
import Crime from "../api/commands/Crime";
import Work from "../api/commands/Work";
import Weekly from "../api/commands/Weekly";
import Atm from "../api/commands/Atm";
import { Cooldowns } from '../api/commands/Cooldowns';
import Tasks from '../api/commands/Tasks';
import Claim from "../api/commands/Claim";
import Double from "../api/commands/Double";
import Vote from '../api/commands/Vote';
import Pay from '../api/commands/Pay';
import Vip from "../api/commands/Vip";
import Raffle from '../api/commands/Raffle';
import Bet from "../api/commands/Bet";
import { Tiger } from "../api/commands/Tiger";
import Jackpot from "../api/commands/Jackpot";
import Drop from "../api/commands/Drop";
import Mines from "../api/commands/Mines";
import Dice from "../api/commands/Dice";
import Horse from "../api/commands/Horse";
import EditEmoji from "../api/commands/EditEmoji";
import Transactions from "../api/commands/Transactions";
import Rep from "../api/commands/Rep";
import Reps from "../api/commands/Reps";
import Marry from "../api/commands/Marry";
import Roulette from "../api/commands/Roulette";
import Top from "../api/commands/Top";
import Invite from "../api/commands/Invite";
import BotInfo from "../api/commands/BotInfo";
import UserController from "../database/controllers/UserController";
import Ban from "../api/commands/Ban";


export const commands: { [key: string]: typeof Command } = {
    "edituser": EditUser,
    "say": Say,
    "daily": Daily,
    "crime": Crime,
    "work": Work,
    "weekly": Weekly,
    "atm": Atm,
    "cooldowns": Cooldowns,
    "tasks": Tasks,
    "claim": Claim,
    "double": Double,
    "vote": Vote,
    "pay": Pay,
    "vip": Vip,
    "raffle": Raffle,
    "coinflip": Bet,
    "tiger": Tiger,
    "jackpot": Jackpot,
    "drop": Drop,
    "mines": Mines,
    "dice": Dice,
    "horse": Horse,
    "editemoji": EditEmoji,
    "transactions": Transactions,
    "rep": Rep,
    "reps": Reps,
    "marry": Marry,
    "roulette": Roulette,
    "top": Top,
    "invite": Invite,
    "botinfo": BotInfo,
    "ban": Ban
}

export default function executeAction(cmdName: string, interaction: Interaction<CacheType>) {
    UserController.getUserById(interaction.user.id).then((res) => {

        if(!res?.banned)
            commands[cmdName].execute(interaction as CommandInteraction);
    });
}