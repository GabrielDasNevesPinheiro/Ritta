import mongoose from "mongoose";
import connectDatabase from "./database/Connection";
import UserController from "./database/controllers/UserController";
import { Settings } from "./database/models/Settings";
import { ItemType, Rarity, Store } from "./database/models/Store";
import Title from "./database/static/Title";
import { deleteCommands } from "./api/Register";

//connectDatabase();

async function resetPoints() {
    let users = await UserController.getAllUsers();

    users.forEach(async (user) => {
        user.weeklydate = null;
        user.dailydate = null;
        user.crimedate = null;
        user.workdate = null;
        user.vipDate = new Date();
        await UserController.updateUser(String(user.userId), user);
    });
}

async function setupSettings() {

    let settings = await Settings.create({
        botname: "Leozito Test",
        cashname: "Fichas"
    });
    await settings.save();

}

async function showUsers() {
    let users = await UserController.getAllUsers();
    users.forEach(async (user) => {
        console.log(user);
        console.log(user);
    });
}

const addItemToStore = async (url: string, name: string, price: number, rarity: number, restricted: boolean = false) => await (await Store.create({ 
    name,
    url,
    rarity,
    price,
    restricted,
    itemType: ItemType.BADGE
})).save();

async function addBadges() {
    let images = ["https://i.imgur.com/MubXB1I.png", "https://i.imgur.com/E5msZwi.png", "https://i.imgur.com/PP6VynY.png", "https://i.imgur.com/MuOiIUj.png", "https://i.imgur.com/7GBKroG.png", "https://i.imgur.com/84utvip.png", "https://i.imgur.com/cJwAxLC.png", "https://i.imgur.com/JJ7tFO1.png", "https://i.imgur.com/tqqTMmW.png", "https://i.imgur.com/Cib92JJ.png", "https://i.imgur.com/ICdptfo.png", "https://i.imgur.com/f7vnBQ7.png", "https://i.imgur.com/9KNVUAR.png", "https://i.imgur.com/WWlYni6.png", "https://i.imgur.com/gaZHm8s.png", "https://i.imgur.com/5Ih5HYy.png", "https://i.imgur.com/SQabNUF.png", "https://i.imgur.com/pq4sAq4.png", "https://i.imgur.com/sXxnP3U.png", "https://i.imgur.com/KgA4ZQj.png", "https://i.imgur.com/MGIceBh.png", "https://i.imgur.com/16Gl1W9.png", "https://i.imgur.com/IVooNdQ.png", "https://i.imgur.com/PFFLoZg.png", "https://i.imgur.com/oU1ssmE.png", "https://i.imgur.com/gAhwd4Y.png", "https://i.imgur.com/IR6Fzb0.png", "https://i.imgur.com/Zy3NqDc.png", "https://i.imgur.com/XN4AUFg.png", "https://i.imgur.com/aKBBFae.png", "https://i.imgur.com/dhJDu7n.png", "https://i.imgur.com/MGyfYYJ.png", "https://i.imgur.com/07A09F8.png", "https://i.imgur.com/mPjHpXb.png", "https://i.imgur.com/Ip0wJEu.png", "https://i.imgur.com/re1Pw0e.png", "https://i.imgur.com/2EnVWhS.png", "https://i.imgur.com/kcvDH9c.png", "https://i.imgur.com/cjXKJDK.png", "https://i.imgur.com/b054rbC.png", "https://i.imgur.com/9wId1Zo.png", "https://i.imgur.com/kbFxhWY.png"];
    const names = ["Yoroi", "Poke Ball", "Luxury Ball", "Hattmos", "Blizzard King", "Black Panther", "Mr Potato", "Elite Troll", "Mythical King", "Mr Capybara", "Lion", "Love Cat", "Hana Hana no Mi", "Ito Ito no Mi", "Gomu Gomu no Mi", "Expert Wizard", "Squire", "Red Demon", "Golden Demon", "Havoc", "Stylish Panda", "Archery", "Wolf cub", "Night Wolf", "Golden Tiger", "Diamond Tiger", "Bat", "Skeleton", "Skeleton Legend", "King Cat", "Paw", "Mask", "Fire Demon", "RGB Demon", "Medal of Honor", "Medal of Respect", "Golden Reaper", "Scary Mask", "Ninja", "Flower", "Lion", "Leozito"];
    const rarities = [Rarity.RARE, Rarity.COMMON, Rarity.COMMON, Rarity.MYTHIC, Rarity.MYTHIC, Rarity.RARE, Rarity.COMMON, Rarity.MYTHIC, Rarity.MYTHIC, Rarity.COMMON, Rarity.COMMON, Rarity.COMMON, Rarity.RARE, Rarity.RARE, Rarity.RARE, Rarity.RARE, Rarity.COMMON, Rarity.MYTHIC, Rarity.MYTHIC, Rarity.MYTHIC, Rarity.COMMON, Rarity.COMMON, Rarity.RARE, Rarity.RARE, Rarity.MYTHIC, Rarity.MYTHIC, Rarity.MYTHIC, Rarity.RARE, Rarity.MYTHIC, Rarity.COMMON, Rarity.COMMON, Rarity.COMMON, Rarity.COMMON, Rarity.COMMON, Rarity.MYTHIC, Rarity.MYTHIC, Rarity.COMMON, Rarity.COMMON, Rarity.COMMON, Rarity.COMMON, Rarity.ULTRA_MYTHIC, Rarity.ULTRA_MYTHIC];
    const prices = [500000, 200000, 215000, 4500000, 3000000, 900000, 400000, 4000000, 5500000, 300000, 500000, 450000, 700000, 700000, 700000, 800000, 500000, 1000000, 1000000, 4200000, 650000, 200000, 1300000, 2000000, 9200000, 10700000, 3100000, 3000000, 4000000, 930000, 355000, 100000, 300000, 400000, 5500000, 6000000, 250000, 70000, 80000, 120000, 25000000, 50000000]

    images.forEach(async (image, index) => await addItemToStore(image, names[index], prices[index], rarities[index]));

    
    
}

async function addRestrictedBadges() {
    let images = ["https://i.imgur.com/WzXqcKe.png", "https://i.imgur.com/8g1PWp8.png", "https://i.imgur.com/Muu71LS.png", "https://i.imgur.com/lKQfMsC.png", "https://i.imgur.com/u2dNBbC.png", "https://i.imgur.com/Lf58UHW.png", "https://i.imgur.com/pYHfMbJ.png"];
    let names = ["VIP", "Bug Hunter", "Moderator", "Booster", "Developer", "Admin", "Nitro"];

    images.forEach(async (image, index) => await addItemToStore(image, names[index], 0, Rarity.COMMON, true));
}


deleteCommands();