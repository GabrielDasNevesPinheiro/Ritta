import mongoose, { ObjectId } from "mongoose";


interface IReputation {
    to: String
    from: String
    message: String
}

const reputationSchema = new mongoose.Schema<IReputation>({
    to: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true    
    }
});

const Reputation: mongoose.Model<IReputation> = mongoose.models.Reputation || mongoose.model<IReputation>("Reputation", reputationSchema);

export { Reputation, type IReputation, reputationSchema }