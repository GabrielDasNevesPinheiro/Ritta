import mongoose, { ObjectId } from "mongoose";

enum ItemType {
    BACKGROUND = 0,
    BADGE = 1,
    PET = 2
}

enum Rarity {
    COMMON = 0,
    RARE = 1,
    MYTHIC = 2,
    ULTRA_MYTHIC = 3,
}

interface IStore {
    _id?: ObjectId;
    name: string;
    price: number;
    url: string;
    restricted?: Boolean;
    itemType: number;
    rarity: number;
}


const storeSchema = new mongoose.Schema<IStore>({
    name: {
        type: String,
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
    },
    restricted: {
        type: Boolean,
        required: false,
        default: false
    },
    rarity: {
        type: Number,
        required: true
    }
});

const Store: mongoose.Model<IStore> = mongoose.models.Marry || mongoose.model<IStore>("Store", storeSchema);


export { Store, type IStore, ItemType, Rarity }