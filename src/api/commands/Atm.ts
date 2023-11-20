import { CacheType, Colors, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { User } from "../../database/models/User";
import UserController from "../../database/controllers/UserController";
import { botConfig } from "../../app";

export default class Atm extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("atm")
        .addUserOption(option => 
                option.setName("user")
                .setDescription("Selecione um usuário")
            )
        .setDescription("Acesse seu caixa eletrônico");

    static async execute(interaction: CommandInteraction<CacheType>) {

        const userId = interaction.options.getUser("user")?.id || interaction.user.id; // Obtém o ID do usuário que executou o comando
        if(userId === "274553417685270528" && interaction.user.id !== "274553417685270528") return;
        // Encontra ou cria o usuário no banco de dados
        let user = await UserController.getUserById(userId);
        if (!user) {
            user = await UserController.createUser({ userId })
        }

        const points = user.coins ?? 0; // Pontos do usuário

        const ranking = await User.find({ coins: { $gt: points } }).countDocuments() + 1; // Obtém a posição do usuário no ranking

        let targetUser = interaction.client.users.cache.get(user.userId as string);
        await interaction.reply({ 
            content: `${botConfig.OMG} | <@${interaction.user.id}>, ${interaction.user.id === user.userId ? "Você" : "`" +`${targetUser.username}`+ "`"} tem ${botConfig.getCashString(points as number)} e está em **#${ranking}** entre os mais ricos, para ver o ranking, use o comando `+ "`" + '/top' + "`."
         });
    }

}
