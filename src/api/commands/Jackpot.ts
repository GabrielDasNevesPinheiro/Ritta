import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { checkBetValues } from "../../util/InteractionUtils";
import { getJackpotResult } from "../../util/ImageUtils";


export default abstract class Jackpot extends Command {
    
    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("jackpot")
        .addIntegerOption(option => 
            option.setName("ammount")
            .setDescription("Quantidade da aposta")
            .setMinValue(20)
            .setRequired(true)
            ).setDescription("Aposte no jackpot")
            
    static async execute(interaction: CommandInteraction<CacheType>) {
        
        await interaction.deferReply({});

        let ammount = interaction.options.get("ammount").value as number;

        let res = await checkBetValues(String(ammount), interaction);

        if(!res) return;

        await interaction.editReply({
            content: `Calma, é só um teste ainda`,
            files: [await getJackpotResult([])]
        })

    }
}