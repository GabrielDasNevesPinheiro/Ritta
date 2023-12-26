import { CacheType, Collection, CommandInteraction, Interaction } from "discord.js";
import Command from '../api/commands/Command';
import path from "path";
import fs from "fs";
import UserController from "../database/controllers/UserController";
import { cooldowns } from "../util/InteractionUtils";

let restricted = ["edituser", "ban", "banlist", "addbadge"];

let xpCooldown = new Collection<String, Boolean>();

export const commands: { [key: string]: typeof Command } = parseSlashCommands();
export const restrictedCommands: { [key: string]: typeof Command } = parseRestrictedCommands();

export default function executeAction(cmdName: string, interaction: Interaction<CacheType>) {
    UserController.getUserById(interaction.user.id).then(async (res) => {

        if (!res?.banned) {

            if (commands[cmdName])
                commands[cmdName].execute(interaction as CommandInteraction);
            else
                restrictedCommands[cmdName].execute(interaction as CommandInteraction);

            cooldowns.set(interaction.user.id, true);

            if (!xpCooldown.has(interaction.user.id)) {
                res.xp += 24;
                await UserController.updateUser(String(res.userId), res);
            }

            setTimeout(() => {
                cooldowns.delete(interaction.user.id);
            }, 3000);

            setTimeout(() => {
                xpCooldown.delete(interaction.user.id);
            }, 120000);

            xpCooldown.set(interaction.user.id, true);
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
                if (command?.command)
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
                if (command?.command)
                    cmdlist[command.command.name] = command;
            }
        }
    });

    return cmdlist;
}