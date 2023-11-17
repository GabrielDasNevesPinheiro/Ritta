import { ITransaction } from '../models/Transaction';
import { User, IUser } from '../models/User';
import TransactionController from './TransactionController';

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

    static async addCash(user: IUser, trans: ITransaction) {
        try {
            
            let foundUser: IUser = await User.findOne({ userId: user.userId });
            if(!foundUser) return null;

            foundUser.coins = Number(foundUser.coins) + Number(trans.ammount);

            await TransactionController.createTransaction(trans);

            foundUser = await this.updateUser(foundUser.userId as string, foundUser);

            return foundUser;


        } catch (error) {
            return null;
        }
    }

    static async removeCash (user: IUser, trans: ITransaction) {
        try {
            
            let foundUser: IUser = await User.findOne({ userId: user.userId });
            if(!foundUser) return null;

            foundUser.coins = Number(foundUser.coins) - Number(trans.ammount);

            if(Number(foundUser.coins) < 0) foundUser.coins = 0;

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