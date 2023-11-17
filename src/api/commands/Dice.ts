import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { checkBetValues } from "../../util/InteractionUtils";
import { getDice } from "../../util/ImageUtils";


export default abstract class Dice extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
    .setName("dice")
    .addIntegerOption(option => 
            option.setName("ammount")
            .setDescription("Quantidade da aposta")
            .setRequired(true)
            .setMinValue(1500)
        )
    .setDescription("Aposte com o dado")

    static async execute(interaction: CommandInteraction<CacheType>) {
        await interaction.deferReply();

        let ammount = interaction.options.get("ammount").value as number;
        let canBet = await checkBetValues(String(ammount), interaction);

        if(!canBet) return;

        let file = await getDice(30);
        await interaction.editReply({ files: [file] });
    }

}