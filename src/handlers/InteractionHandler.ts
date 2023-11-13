import { CacheType, CommandInteraction, Interaction } from "discord.js";
import Command from "../api/commands/Command";


export const commands: { [key: string]: typeof Command } = {

}

export default function executeAction(cmdName: string, interaction: Interaction<CacheType>) {
    commands[cmdName].execute(interaction as CommandInteraction);
}