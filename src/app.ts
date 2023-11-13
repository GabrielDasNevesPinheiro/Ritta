import { Client, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import connectDatabase from "./database/Connection";
import { Settings } from "./database/models/Settings";

config()
const token = process.env.BOT_TOKEN;
let cashname = "";

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
    bot.user.setUsername(settings.botname as string);
    cashname = settings.cashname as string;

});

client.on("messageCreate", async (message) => {
    
});

client.login(token);

export { cashname }