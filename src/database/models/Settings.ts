import mongoose from "mongoose"

class ISettings {
    botname: String
    cashname: String

}

const settingsSchema = new mongoose.Schema<ISettings>({
    botname: {
        type: String,
        required: true,
    },
    cashname: {
        type: String,
        required: true
    }
});

const Settings = mongoose.models.Settings || mongoose.model<ISettings>("Settings", settingsSchema);

export { Settings, type ISettings }