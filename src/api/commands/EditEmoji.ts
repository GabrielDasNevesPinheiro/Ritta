import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { isVipExpired } from "../../util/DateUtils";
import UserController from "../../database/controllers/UserController";
import { botConfig } from "../../app";


export default abstract class EditEmoji {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("editemoji")
        .addStringOption(option =>
            option.setName("emoji")
                .setDescription("O Emoji a ser usado")
                .setRequired(true)
        ).addIntegerOption(option =>
            option.setName("slot")
                .setDescription("Esse emoji ficará como cara ou coroa?")
                .addChoices({ name: "Cara", value: 0 }, { name: "Coroa", value: 1 })
                .setRequired(true)
        )
        .setDescription("Edite os emojis do coinflip")


    static async execute(interaction: CommandInteraction<CacheType>) {

        await interaction.deferReply({ ephemeral: true });

        let index = interaction.options.get("slot").value as number;
        let emoji = interaction.options.get("emoji").value as string;


        let user = await UserController.getUserById(interaction.user.id);

        if(!user) return;

        if(isVipExpired(user).allowed) return await interaction.editReply({ content: `${botConfig.CONFUSED} | <@${user.userId}>, Você precisa ser __VIP__ para realizar esta ação.` });

        if(!isEmoji(emoji)) return await interaction.editReply({ content: `${botConfig.CONFUSED} | <@${user.userId}>, Você precisa me fornecer um emoji.` });

        botConfig.emojis[index] = emoji;

        await interaction.editReply({ content: `${botConfig.CONFUSED} | <@${user.userId}>, Agora o emoji ${emoji} estará na aposta.` })

    }
}

function isEmoji(character: string): boolean {
    const emojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}]/u;
    return emojiRegex.test(character);
  }
