import { botConfig } from "../app";
import UserController from "../database/controllers/UserController";
import { isVipExpired } from "./DateUtils";


export async function countVipPassiveCash() {

    let users = await UserController.getAllUsers();

    users.forEach(async (user) => {
        if (!isVipExpired(user)) {
            user.coins = Number(user.coins) + botConfig.vipPassiveEarning;
            await UserController.updateUser(String(user.userId), user);
        }
    });

}