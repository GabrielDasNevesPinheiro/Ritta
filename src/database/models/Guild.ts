import mongoose from "mongoose";


interface IGuild {
    language: String
}

const guildSchema = new mongoose.Schema<IGuild>({
    language: {
        type: String,
        required: true
    }
});

const Guild = mongoose.models.Guild || mongoose.model<IGuild>("Guild", guildSchema);

export { Guild, type IGuild }