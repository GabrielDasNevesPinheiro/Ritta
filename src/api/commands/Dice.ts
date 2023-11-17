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

        let num = getDiceRandomNumber();
        let file = await getDice(num);
        await interaction.editReply({ files: [file] });
        
    }

}



function getDiceRandomNumber() {
    const chanceMenorQue50 = 0.3;

  const random = Math.random();
  
  if (random < chanceMenorQue50) {
    
    return Math.floor(Math.random() * 50);
  } else {
    
    return Math.floor(Math.random() * (100 - 50) + 50);
  }
}