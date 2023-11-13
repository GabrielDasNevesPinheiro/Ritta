import { CacheType, CommandInteraction, Interaction } from "discord.js";
import Command from "../api/commands/Command";
import EditUser from "../api/commands/EditUser";
import Say from "../api/commands/Say";
import Daily from "../api/commands/Daily";


export const commands: { [key: string]: typeof Command } = {
    "edituser": EditUser,
    "say": Say,
    "daily": Daily
}

export default function executeAction(cmdName: string, interaction: Interaction<CacheType>) {
    commands[cmdName].execute(interaction as CommandInteraction);
}