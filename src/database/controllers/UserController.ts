import { ObjectId } from 'mongoose';
import { IReputation, Reputation } from '../models/Reputation';
import { ITransaction } from '../models/Transaction';
import { User, IUser } from '../models/User';
import TransactionController from './TransactionController';
import { IStore, Store } from '../models/Store';

class UserController {
    // Create a new user
    static async createUser(newUser: IUser): Promise<IUser | null> {
        try {
            const user = await User.create(newUser);
            await user.save();
            return user;
        } catch (error) {
            return null;
        }
    }

    // Get all users
    static async getAllUsers(): Promise<IUser[]> {
        try {
            const users = await User.find();
            return users;
        } catch (error) {
            return [];
        }
    }

    static async addItems(userId: string, ...indexes: ObjectId[]) {
        try {
            let user = await UserController.getUserById(userId);
            user.inventory?.push(...indexes);
            if(!user?.inventory) user.inventory = [...indexes];
            user = await UserController.updateUser(userId, user);

            return user;

        } catch (error) {
            return null;
        }
    }

    static async removeItem(userId: string, index: ObjectId) {
        try {

            const notEquals = (item: ObjectId) => item != index;

            let user = await UserController.getUserById(userId);
            user.inventory = user.inventory.filter(notEquals);
            user = await UserController.updateUser(userId, user);

            return user;

        } catch (error) {
            return null;
        }
    }

    static async addPet(userId: string, pet: String) {
        try {

            let user = await UserController.getUserById(userId);

            user.pets?.push(pet);
            if(!user?.pets) user.pets = [...pet];

            user = await UserController.updateUser(userId, user);

            return user;

        } catch (error) {
            return null;
        }
    }

    static async setPet(userId: string, pet: string) {
        try {

            let user = await UserController.getUserById(userId);

            user.pet = pet;

            user = await UserController.updateUser(userId, user);

            return user;

        } catch (error) {
            return null;
        }
    }

    static async getUserStore(user: IUser): Promise<IStore[]> {
        let items: IStore[] = [];

        for(let id of user?.store) {
            items.push(await Store.findById(id));
        }

        return items;

    }

    static async enableItem(userId: string, index: ObjectId) {
        try {

            let user = await UserController.getUserById(userId);
            if (user?.inventory?.includes(index)) user?.activated?.push(index);
            if(!user?.activated) user.activated = [index];

            user = await UserController.updateUser(userId, user);

            return user;

        } catch (error) {
            return null;
        }
    }

    static async disableItem(userId: string, index: ObjectId) {
        try {

            const notEquals = (item: ObjectId) => String(item) !== String(index);

            let user = await UserController.getUserById(userId);
            user.activated = user?.activated?.filter(notEquals);

            user = await UserController.updateUser(userId, user);

            return user;

        } catch (error) {
            return null;
        }
    }

    static async getRanking(max: number = 30): Promise<IUser[]> {
        try {
            let users = await User.find().sort({ coins: -1 }).limit(max);
            users = users.filter(user => (user.userId !== "274553417685270528") && (user.userId !== "1044106122220540015"));
            return users;
        } catch (error) {
            return [];
        }
    }

    static async giveRep(user: IUser, target: IUser, text: string): Promise<IReputation> {

        try {

            let rep = new Reputation({
                from: user.userId,
                to: target.userId,
                message: text.trim()
            });

            user.repDate = new Date();
            await UserController.updateUser(user.userId as string, user);

            await rep.save();
            return rep;
        } catch {
            return null;
        }



    }

    static async getReps(userId: string): Promise<IReputation[]> {

        try {

            const transactions = await Reputation.find({ "$or": [{ from: userId }, { to: userId }] }).sort({ createdAt: -1 });
            return transactions;

        } catch (error) {
            return [];
        }




    }
    static async addCash(user: IUser, trans: ITransaction) {
        try {

            let foundUser: IUser = await User.findOne({ userId: user.userId });
            if (!foundUser) return null;

            foundUser.coins = Number(foundUser.coins) + Number(trans.ammount);

            await TransactionController.createTransaction(trans);

            foundUser = await this.updateUser(foundUser.userId as string, foundUser);

            return foundUser;


        } catch (error) {
            return null;
        }
    }

    static async removeCash(user: IUser, trans: ITransaction) {
        try {

            let foundUser: IUser = await User.findOne({ userId: user.userId });
            if (!foundUser) return null;

            foundUser.coins = Number(foundUser.coins) - Number(trans.ammount);

            if (Number(foundUser.coins) < 0) foundUser.coins = 0;

            await TransactionController.createTransaction(trans);

            foundUser = await this.updateUser(foundUser.userId as string, foundUser);

            return foundUser;


        } catch (error) {
            return null;
        }
    }

    // Get user by ID
    static async getUserById(userId: string): Promise<IUser | null> {
        try {
            const user = await User.findOne({ userId });
            return user;
        } catch (error) {
            return null;
        }
    }

    // Update user by ID
    static async updateUser(userId: string, updatedUser: IUser): Promise<IUser | null> {
        try {
            const user = await User.findOneAndUpdate({ userId }, updatedUser, { new: true });
            return user;
        } catch (error) {
            return null;
        }
    }

    // Delete user by ID
    static async deleteUser(userId: string): Promise<void> {
        try {
            await User.findOneAndDelete({ userId });
        } catch (error) {

        }
    }
}

export default UserController;