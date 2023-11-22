import { CacheType, CommandInteraction, SlashCommandBuilder, User } from "discord.js";
import Command from "./Command";
import UserController from "../../database/controllers/UserController";
import getRank from "../../util/ImageUtils";
import { botConfig } from "../../app";

export default abstract class Top extends Command {
    
    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("top").setDescription("Exibe o ranking dos melhores");

    static async execute(interaction: CommandInteraction<CacheType>) {

        await interaction.deferReply({});
        await interaction.editReply({ content: `${botConfig.WAITING} | <@$${interaction.user.id}>, um momento...` });

        let users = await UserController.getRanking();
        let fetched: User[] = [];

        for(let user of users) {
            fetched.push(await interaction.client.users.fetch(String(user.userId)));
        }

        let ranking = await getRank(fetched, users);

        await interaction.editReply({ files: [ranking], content: `` });

    }
}