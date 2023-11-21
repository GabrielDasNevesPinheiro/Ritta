import connectDatabase from "./database/Connection";
import TransactionController from "./database/controllers/TransactionController";
import UserController from "./database/controllers/UserController";
import { Settings } from "./database/models/Settings";
import { ITransaction } from "./database/models/Transaction";
import { cooldownCheck, isVipExpired } from "./util/DateUtils";

connectDatabase();

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
        botname: "Leozito",
        cashname: "Fichas"
    });
    await settings.save();

}

async function showUsers() {
    let users = await UserController.getAllUsers();
    users.forEach((user) => {
        console.log(isVipExpired(user), user.userId)
    })
}



