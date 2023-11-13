import mongoose, { ObjectId } from "mongoose";


interface IRaffle {
    winner: ObjectId,
    bet: Number,
    won: Number,
}

const raffleSchema = new mongoose.Schema<IRaffle>({
    winner: {
        type: mongoose.Types.ObjectId,
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

const Raffle = mongoose.models.Raffle || mongoose.model<IRaffle>("Raffle", raffleSchema);

export { Raffle, type IRaffle }