import mongoose, { ObjectId } from "mongoose";


interface IRaffle {
    winner: String,
    bet: Number,
    won: Number,
}

const raffleSchema = new mongoose.Schema<IRaffle>({
    winner: {
        type: String,
        required: true,
    },
    bet: {
        type: Number,
        required: true,
    },
    won: {
        type: Number,
        required: true,
    }
});

const Raffle: mongoose.Model<IRaffle> = mongoose.models.Raffle || mongoose.model<IRaffle>("Raffle", raffleSchema);

export { Raffle, type IRaffle }