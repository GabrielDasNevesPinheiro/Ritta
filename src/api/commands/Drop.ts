import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { checkBetValues, checkMaxValues } from "../../util/InteractionUtils";
import UserController from "../../database/controllers/UserController";

export default abstract class Drop extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("drop")
        .addIntegerOption(option =>
            option.setName("ammount")
                .setDescription("Quantia que você irá patrocinar")
                .setMinValue(1500)
                .setRequired(true)
        )
        .setDescription("Patrocine um drop no chat");
        
        static async execute(interaction: CommandInteraction<CacheType>) {
            
            let ammount = interaction.options.get("ammount").value as number;

            let res = await checkBetValues(String(ammount), interaction);

            let user = await UserController.getUserById(interaction.user.id);

            let canBet = await checkMaxValues(interaction, user, ammount);

            if(!res) return;
            if(!canBet) return;

        }
}