import { REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from 'discord.js';
import { config } from 'dotenv';
import { commands as cmdList, restrictedCommands } from '../handlers/InteractionHandler';

config();

const token = process.env.BOT_TOKEN;
const client_id = process.env.CLIENT_ID;

const rest = new REST({ version: '10' }).setToken(token);

let commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
let privateCommands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

for (let cmd in cmdList) {

    commands.push(cmdList[cmd].command.toJSON());

}

for (let cmd in restrictedCommands) {

    privateCommands.push(restrictedCommands[cmd].command.toJSON());
    
}


export function postSlashCommands() {

    try {

        rest.put(Routes.applicationCommands(client_id), { body: commands })
        .then(() => console.log("GLOBAL COMMANDS UPDATED"));
        
        rest.put(Routes.applicationGuildCommands(client_id, "1178356953274142820"), { body: privateCommands })
        .then(() => console.log("ADMIN COMMANDS UPDATED"));

    } catch (error) {

        console.log(`Error while registering slash commands: ${error}`);

    }
}


export function deleteCommands() {
    rest.put(Routes.applicationCommands(client_id), { body: [] })

}

export { commands as CommandsArray }
