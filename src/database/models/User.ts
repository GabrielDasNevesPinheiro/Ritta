import mongoose, { ObjectId } from "mongoose";
import { reputationSchema } from "./Reputation";
import { transactionSchema } from "./Transaction";

interface IUser {
    userId: String
    about?: String
    inventory?: Array<ObjectId>
    activated?: Array<ObjectId>
    pets: Array<String>
    xp?: number
    partner?: String
    coins?: Number
    banned?: Boolean
    banReason?: String
    boosterDate?: Date
    rouletteDate?: Date
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
    inventory: {
        type: [mongoose.Types.ObjectId],
        default: [],
        required: false
    },
    activated: {
        type: [mongoose.Types.ObjectId],
        default: [],
        required: false
    },
    pets: {
        type: [String],
        required: false,
        default: []
    },
    xp: {
        type: Number,
        required: false,
        default: 0
    },
    banReason: {
        type: String,
        required: false,
        default: null,
    },
    partner: {
        type: String,
        required: false,
        default: null
    },
    banned: {
        type: Boolean,
        required: false,
        default: false
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
    rouletteDate: {
        type: Date,
        required: false,
        default: null
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