import { CacheType, CommandInteraction, Interaction } from "discord.js";
import Command from "../api/commands/Command";
import EditUser from "../api/commands/EditUser";
import Say from "../api/commands/Say";


export const commands: { [key: string]: typeof Command } = {
    "edituser": EditUser,
    "say": Say,
}

export default function executeAction(cmdName: string, interaction: Interaction<CacheType>) {
    commands[cmdName].execute(interaction as CommandInteraction);
}