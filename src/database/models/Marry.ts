import mongoose, { ObjectId } from "mongoose";


interface IMarry {
    lover: String,
    lover2: String,
    divorce: Boolean
    date: Date
}

const marrySchema = new mongoose.Schema<IMarry>({
    lover: {
        type: String,
        required: true,
    },
    lover2: {
        type: String,
        required: true,
    },
    divorce: {
        type: Boolean,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

const Marry: mongoose.Model<IMarry> = mongoose.models.Marry || mongoose.model<IMarry>("Marry", marrySchema);

export { Marry, type IMarry }