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


export const commands: { [key: string]: typeof Command } = {
    "edituser": EditUser,
    "say": Say,
    "daily": Daily,
    "crime": Crime,
    "work": Work,
    "weekly": Weekly,
    "atm": Atm,
    "cooldowns": Cooldowns,
}

export default function executeAction(cmdName: string, interaction: Interaction<CacheType>) {
    commands[cmdName].execute(interaction as CommandInteraction);
}