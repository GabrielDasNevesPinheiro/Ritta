import { REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from 'discord.js';
import { config } from 'dotenv';
import { commands as cmdList } from '../handlers/InteractionHandler';

config();

const token = "MTE3MzY2OTM4NzAyMzE2NzY2OA.GE5jrG.VKJLYHUYAfO2y87qsGg8ynRc8zBdePZEEIPJ38";
const client_id = "1173669387023167668";

const rest = new REST({ version: '10' }).setToken(token);

let commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

for (let cmd in cmdList) {

    commands.push(cmdList[cmd].command.toJSON());

}


export default function postSlashCommands() {

    try {

        console.log("UPDATING SLASH COMMANDS...");

        rest.put(Routes.applicationCommands(client_id), { body: commands });

        console.log("DONE, MY ROOSTER.");

    } catch (error) {

        console.log(`Error while registering slash commands: ${error}`);

    }
}

export { commands as CommandsArray }