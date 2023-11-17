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
    "bet": Bet,
    "tiger": Tiger,
    "jackpot": Jackpot,
    "drop": Drop,
}

export default function executeAction(cmdName: string, interaction: Interaction<CacheType>) {
    commands[cmdName].execute(interaction as CommandInteraction);
}