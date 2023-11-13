import mongoose, { ObjectId } from "mongoose";


interface IReputation {
    to: ObjectId
    from: ObjectId
    message: String
}

const reputationSchema = new mongoose.Schema<IReputation>({
    to: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    from: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    message: {
        type: String,
        required: true    
    }
});

const Reputation = mongoose.models.Reputation || mongoose.model<IReputation>("Reputation", reputationSchema);

export { Reputation, type IReputation, reputationSchema }