import mongoose, { ObjectId } from "mongoose";


interface ITransaction {
    to: ObjectId
    from: ObjectId
    ammount: Number

}

const transactionSchema = new mongoose.Schema<ITransaction>({
    to: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    from: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    ammount: {
        type: Number,
        required: true,
    }
});

const Transaction = mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", transactionSchema);

export { Transaction, type ITransaction, transactionSchema }