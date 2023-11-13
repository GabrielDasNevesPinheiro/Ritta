import mongoose, { ObjectId } from "mongoose";


interface ITransaction {
    to: String,
    from: String,
    ammount: Number

}

const transactionSchema = new mongoose.Schema<ITransaction>({
    to: {
        type: String,
        required: true,
    },
    from: {
        type: String,
        required: true,
    },
    ammount: {
        type: Number,
        required: true,
    }
});

const Transaction: mongoose.Model<ITransaction> = mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", transactionSchema);

export { Transaction, type ITransaction, transactionSchema }