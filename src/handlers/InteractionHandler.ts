import { CacheType, CommandInteraction, Interaction } from "discord.js";
import Command from "../api/commands/Command";
import EditUser from "../api/commands/EditUser";
import Say from "../api/commands/Say";
import Daily from "../api/commands/Daily";
import Crime from "../api/commands/Crime";
import Work from "../api/commands/Work";


export const commands: { [key: string]: typeof Command } = {
    "edituser": EditUser,
    "say": Say,
    "daily": Daily,
    "crime": Crime,
    "work": Work,
}

export default function executeAction(cmdName: string, interaction: Interaction<CacheType>) {
    commands[cmdName].execute(interaction as CommandInteraction);
}