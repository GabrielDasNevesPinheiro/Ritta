import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CacheType, Colors, CommandInteraction, ComponentType, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { checkBetValues, checkMaxValues, getTax } from "../../util/InteractionUtils";
import { getDice } from "../../util/ImageUtils";
import UserController from "../../database/controllers/UserController";
import { botConfig } from "../../app";
import { isVipExpired, sleep } from "../../util/DateUtils";


export default abstract class Dice extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
    .setName("dice")
    .addIntegerOption(option => 
            option.setName("ammount")
            .setDescription("Quantidade da aposta")
            .setRequired(true)
            .setMinValue(1000)
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

        let tax = getTax(ammount);

        if(!isVipExpired(user).allowed) tax = 0;


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
        
        let response = await interaction.editReply({ embeds: [diceEmbed], components: [row] });
        let collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 30000 });

        let customId = null;
        
        
        collector.on("collect", async (confirmation) => {
          if(confirmation.user.id !== interaction.user.id) return;
          await interaction.editReply({ content: `**Vamos ver o que lhe aguarda...**`, embeds: [], components: []});
          customId = confirmation.customId as "basic" | "medium" | "advanced";
          
          //show gif
          await sleep(3000);
          collector.emit("dispose");

        });


        collector.on("dispose", async (confirmation) => {

          if(!customId) return;

          let bet = 0;
          let multiplier = 0;

          let win = false;

          if(customId === "basic")  {
            multiplier = oneToSevens;
            bet = 75;
          }
          if(customId === "medium")  {
            multiplier = oneToFives;
            bet = 50;
          }
          if (customId == "advanced") { 
            multiplier = oneToTwenties; 
            bet = 25;
          }

          let num = getDiceRandomNumber();
          if (num <= bet) win = true;
          let file = await getDice(num, bet);

          if(win) {

            ammount = Math.floor(ammount * multiplier) - tax;
            if(tax > 0) tax = getTax(ammount);

            user = await UserController.addCash(user, {
              from: "jogando dice",
              to: user.userId,
              ammount: ammount
            });
          } else {
            tax = 0;
            user = await UserController.removeCash(user, {
              from: user.userId,
              to: "jogando dice",
              ammount
            });
          }

          await interaction.editReply({ content: `${botConfig.STONKS} | <@${user.userId}>, Você ${win ? `**GANHOU!** O Dado chamou ${num}.\n**Sua recompensa é de** ${botConfig.getCashString(ammount)}\n${tax > 0 ? `${botConfig.getCashString(tax)} de taxa.` : `` }` : `**perdeu**, apostou no **${multiplier.toFixed(1)}x** mas o Dado foi em **${num}**.\nVocê perdeu ${botConfig.getCashString(ammount)}.`}`, files: [file], embeds: [], components: [] });
          return;
        });
        
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