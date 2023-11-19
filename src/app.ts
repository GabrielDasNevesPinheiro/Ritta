import { Client, GatewayIntentBits, CacheType, TextChannel } from 'discord.js';
import { config } from "dotenv";
import connectDatabase from "./database/Connection";
import { Settings } from "./database/models/Settings";
import postSlashCommands from "./api/Register";
import executeAction from "./handlers/InteractionHandler";
import BotConfig from "./util/BotConfig";
import { countBoosterPassiveCash, countVipPassiveCash, sortRaffle, startCrash } from './util/PassiveSystems';
import UserController from './database/controllers/UserController';
import { cooldownCheck, isVipExpired } from './util/DateUtils';

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
        GatewayIntentBits.GuildMembers,
    ]
});

client.on("ready", async (bot) => {

    let settings = (await Settings.find())[0];

    botConfig = new BotConfig(settings);

    bot.user.setUsername(botConfig.name);
    postSlashCommands();

    //passive systems
    setInterval(countVipPassiveCash, botConfig.vipPassiveEarningCooldown * 1000);
    setInterval(sortRaffle, 10000, client);
    setInterval(countBoosterPassiveCash, botConfig.vipPassiveEarningCooldown * 1000);
    setInterval(startCrash, 70000, client);

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


client.on("guildMemberUpdate", async (old, now) => {

    if (now.guild.id !== "1174342112070869012") return;

    if ((!now.premiumSince && old.premiumSince)) {
        let user = await UserController.getUserById(now.user.id);

        if (!cooldownCheck(720, user?.boosterDate).allowed) {
            await UserController.removeCash(user, {
                from: user?.userId,
                to: "como punição por tentar abusar do nitro.",
                ammount: 30000
            });
            user.boosterDate = null;
            await UserController.updateUser(String(user?.userId), user);

        }

    }

    if (!old.premiumSince && now.premiumSince) {
        let user = await UserController.getUserById(now.user.id);

        if (!user) user = await UserController.createUser({ userId: now.user.id });
        user.boosterDate = new Date();
        await UserController.addCash(user, {
            from: "buffando o servidor oficial do bot",
            to: user.userId,
            ammount: 30000
        });
        await UserController.updateUser(String(user.userId), user);
        let channel = now.client.channels.cache.get("1174342112565805088") as TextChannel;

        await channel.send(`${botConfig.GG} <@${now.user.id}> Impulsionou o servidor e ganhou ${botConfig.getCashString(30000)}!`);

    }

});

client.login(token);

export { botConfig }