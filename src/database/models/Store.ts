import mongoose from "mongoose";



interface IStore {
    name: string;
    price: number;
    url: string;
    itemType: number;
}


const storeSchema = new mongoose.Schema<IStore>({
    name: {
        type: String,
        unique: true,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    url: {
        type: String,
        unique: true,
    },
    itemType: {
        type: Number,
        required: true,
    }
});

const Store: mongoose.Model<IStore> = mongoose.models.Marry || mongoose.model<IStore>("Store", storeSchema);


export { Store, type IStore }