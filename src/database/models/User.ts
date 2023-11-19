import mongoose, { ObjectId } from "mongoose";
import { reputationSchema } from "./Reputation";
import { transactionSchema } from "./Transaction";

interface IUser {
    userId: String
    about?: String
    partner?: String
    coins?: Number
    boosterDate?: Date
    tasksDate?: Date
    repDate?: Date
    vipDate?: Date
    dailydate?: Date
    workdate?: Date
    crimedate?: Date
    votedate?: Date
    weeklydate?: Date
}


const userSchema = new mongoose.Schema<IUser>({
    userId: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: false,
        default: "Descrição do meu perfil."
    },
    partner: {
        type: String,
        required: false,
        default: null
    },
    coins: {
        type: Number,
        required: false,
        default: 0
    },
    tasksDate: {
        type: Date,
        required: false,
        default: null,
    },
    vipDate: {
        type: Date,
        required: false,
        default: null
    },
    boosterDate: {
        type: Date,
        required: false,
        default: null,
    },
    dailydate: {
        type: Date,
        required: false,
        default: null,
    },
    workdate: {
        type: Date,
        required: false,
        default: null,
    },
    crimedate: {
        type: Date,
        required: false,
        default: null,
    },
    votedate: {
        type: Date,
        required: false,
        default: null,
    },
    weeklydate: {
        type: Date,
        required: false,
        default: null,
    },
    repDate: {
        type: Date,
        required: false,
        default: null,
    }
});

const User: mongoose.Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export { User, type IUser }