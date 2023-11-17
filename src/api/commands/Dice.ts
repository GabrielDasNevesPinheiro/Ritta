import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CacheType, Colors, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { checkBetValues, checkMaxValues } from "../../util/InteractionUtils";
import { getDice } from "../../util/ImageUtils";
import UserController from "../../database/controllers/UserController";
import { botConfig } from "../../app";


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
        let res = await checkBetValues(String(ammount), interaction);
        
        if(!res) return;
        
        let user = await UserController.getUserById(interaction.user.id);
        let canBet = await checkMaxValues(interaction, user, ammount);

        if(!canBet) return;


        
        let num = getDiceRandomNumber();
        let file = await getDice(num);

        let oneToSevens = 2.0;
        let oneToFives = 3.0;
        let oneToTwenties = 4.0;

        let twoButton = new ButtonBuilder()
          .setLabel(`${oneToSevens.toFixed(1)}x`)
          .setCustomId("basic")
          .setStyle(ButtonStyle.Secondary)

        let threeButton = new ButtonBuilder()
          .setLabel(`${oneToFives.toFixed(1)}x`)
          .setCustomId("medium")
          .setStyle(ButtonStyle.Secondary)

        let fourButton = new ButtonBuilder()
          .setLabel(`${oneToTwenties.toFixed(1)}x`)
          .setCustomId("advanced")
          .setStyle(ButtonStyle.Secondary)

          let row = new ActionRowBuilder<ButtonBuilder>().addComponents(twoButton, threeButton, fourButton);

        let diceEmbed = new EmbedBuilder()
        .setTitle(`:game_die: Aposte no Dice`)
        .setDescription(` ${botConfig.GG} | <@${user.userId}>, Você está prestes a apostar ${botConfig.getCashString(ammount)} no Dice! Selecione seu número da sorte para continuar.\n` +
        `\n${botConfig.CASH} | Lucros:\n` +
        `Números de 1 - 75: ${oneToSevens.toFixed(1)}x \n` +
        `Números de 1 - 50: ${oneToFives.toFixed(1)}x \n` +
        `Números de 1 - 25: ${oneToTwenties.toFixed(1)}x \n` 
        ).setImage(botConfig.IMG_DICE).setColor(Colors.Red);
        
        await interaction.editReply({ embeds: [diceEmbed], components: [row] });
        
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