import mongoose, { ObjectId } from "mongoose";


interface IMarry {
    lover: ObjectId,
    lover2: ObjectId,
    divorce: Boolean
    date: Date
}

const marrySchema = new mongoose.Schema<IMarry>({
    lover: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    lover2: {
        type: mongoose.Types.ObjectId,
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