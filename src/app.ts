import { Client, GatewayIntentBits, CacheType } from 'discord.js';
import { config } from "dotenv";
import connectDatabase from "./database/Connection";
import { Settings } from "./database/models/Settings";
import postSlashCommands from "./api/Register";
import executeAction from "./handlers/InteractionHandler";
import BotConfig from "./util/BotConfig";
import { countVipPassiveCash } from './util/PassiveSystems';

config()
const token = process.env.BOT_TOKEN;
let botConfig: BotConfig = null;

connectDatabase();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.on("ready", async (bot) => {

    let settings = (await Settings.find())[0];

    botConfig = new BotConfig(settings);

    bot.user.setUsername(botConfig.name);
    postSlashCommands();

    //vip passive cash earning system
    setTimeout(countVipPassiveCash, botConfig.vipPassiveEarningCooldown * 1000);

});

client.on("messageCreate", async (message) => {
    
});

client.on('interactionCreate', async (interaction) => {

    if (!interaction.isChatInputCommand()) return;
    if (!interaction.channel) {
        return;
    }

    executeAction(interaction.commandName, interaction);

});


client.login(token);

export { botConfig }