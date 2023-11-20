import { CacheType, CommandInteraction, SlashCommandBuilder, User } from "discord.js";
import Command from "./Command";
import UserController from "../../database/controllers/UserController";
import getRank from "../../util/ImageUtils";

export default abstract class Top extends Command {
    
    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("top").setDescription("Exibe o ranking dos melhores");

    static async execute(interaction: CommandInteraction<CacheType>) {

        await interaction.deferReply({});
        let users = await UserController.getRanking();
        let fetched: User[] = [];

        for(let user of users) {
            fetched.push(await interaction.client.users.fetch(String(user.userId)));
        }

        let ranking = await getRank(fetched, users);

        await interaction.editReply({ files: [ranking] })

    }
}