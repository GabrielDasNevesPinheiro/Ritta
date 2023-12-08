import { CacheType, CommandInteraction, Interaction } from "discord.js";
import Command from '../api/commands/Command';
import path from "path";
import fs from "fs";
import UserController from "../database/controllers/UserController";
import { cooldowns } from "../util/InteractionUtils";

let restricted = ["edituser", "ban", "banlist"];

export const commands: { [key: string]: typeof Command } = parseSlashCommands();
export const restrictedCommands: { [key: string]: typeof Command } = parseRestrictedCommands();

export default function executeAction(cmdName: string, interaction: Interaction<CacheType>) {
    UserController.getUserById(interaction.user.id).then((res) => {

        if (!res?.banned) {
            commands[cmdName].execute(interaction as CommandInteraction);
            cooldowns.set(interaction.user.id, true);

            setTimeout(() => {
                cooldowns.delete(interaction.user.id);
            }, 3000);
        }
    });
}

function parseSlashCommands(): { [key: string]: typeof Command } {
    const cmdlist: { [key: string]: typeof Command } = {};


    const commandsDir = path.join(__dirname, "../api/commands");

    const files = fs.readdirSync(commandsDir);


    files.forEach((file) => {
        if ((file.endsWith(".js") || file.endsWith(".ts"))) {

            if (file.startsWith("Command")) return;
            
            const command = require(path.join(commandsDir, file)).default;
            
            if (restricted.includes(command?.command.name)) return;
            
            if (command?.command && typeof command.execute === "function") {
                if(command?.command)
                    cmdlist[command.command.name] = command;
            }
        }
    });

    return cmdlist;
}

function parseRestrictedCommands(): { [key: string]: typeof Command } {
    const cmdlist: { [key: string]: typeof Command } = {};


    const commandsDir = path.join(__dirname, "../api/commands");

    const files = fs.readdirSync(commandsDir);


    files.forEach((file) => {
        if ((file.endsWith(".js") || file.endsWith(".ts"))) {

            if (file.startsWith("Command")) return;

            const command = require(path.join(commandsDir, file)).default;
            if (!restricted.includes(command?.command.name)) return;
            if (command?.command && typeof command.execute === "function") {
                if(command?.command)
                    cmdlist[command.command.name] = command;
            }
        }
    });

    return cmdlist;
}