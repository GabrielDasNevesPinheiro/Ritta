import { Client, GatewayIntentBits, CacheType, TextChannel, ActivityType } from 'discord.js';
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

const activities = [
    { name: '/help', type: ActivityType.Watching },
    { name: '/horse', type: ActivityType.Playing },
    { name: '/coinflip', type: ActivityType.Playing },
    { name: '/mines', type: ActivityType.Playing },
    { name: '/double', type: ActivityType.Playing },
    { name: '/jackpot', type: ActivityType.Playing },
    { name: '/tiger', type: ActivityType.Playing },
    { name: '/roulette', type: ActivityType.Playing },
    { name: '/raffle', type: ActivityType.Playing },
    { name: '/dice', type: ActivityType.Playing },
];

let currentActivityIndex = 0;

function setNextActivity() {
    const activity = activities[currentActivityIndex];
    if (!activity) return;

    client.user?.setActivity(activity.name, { type: activity.type as ActivityType });
    currentActivityIndex = (currentActivityIndex + 1) % activities.length;
}

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
    setInterval(setNextActivity, 30000)

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

    if (now.premiumSince) {

        if (!cooldownCheck(0.1, now.premiumSince).allowed) {

            let user = await UserController.getUserById(now.user.id);

            let cargo = now.guild?.roles.cache.get("1175822265015873556");
            if (cargo && now) {
                now.roles.add(cargo)
                    .then(() => {
                        console.log(`Cargo ${cargo.name} adicionado com sucesso para ${now.user.tag}`);
                    })
                    .catch((error) => {
                        console.error('Ocorreu um erro ao adicionar o cargo:', error);
                    });
            }

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


    }

});

client.login(token);

export { botConfig }