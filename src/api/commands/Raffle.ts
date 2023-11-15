import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { getIntegerOption } from "../../util/InteractionUtils";
import { botConfig } from "../../app";
import RaffleManager from "../../util/RaffleManager";
import UserController from "../../database/controllers/UserController";

export default class Raffle extends Command {
    
    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("raffle")
        .addStringOption(option => 
                option.setName("ammount")
                .setDescription("Quantidade de tickets para comprar")
            )
        .setDescription("Compre tickets para a rifa ou veja informações do sorteio");

    static async execute(interaction: CommandInteraction) {
        
        let ammount = getIntegerOption(interaction);

        if(isNaN(ammount)) {

            let stats = RaffleManager.getStats();

            return await interaction.reply({
                content: `# Rifa do ${botConfig.name}\n${botConfig.CASH} | Prêmio: ${stats.price}\n:tickets: | Tickets: ${stats.tickets}\n:busts_in_silhouette: | Participantes: ${stats.players} \n:hourglass: | Finaliza em: <t:${stats.endTime}> (<t:${stats.endTime}:R>)\n` +
                (RaffleManager.lastWinner ? `# Último Ganhador\n## **${interaction.client.users.cache.get(String(RaffleManager.lastWinner.userId)).username}** - (${botConfig.getCashString(RaffleManager.lastWinnerWon)})` : `# Sem informações de um último ganhador.` ) + "\n" +
                `:information_source: Para participar compre tickets utilizando este mesmo comando. Cada ticket custa ${botConfig.getCashString(RaffleManager.rafflePrice)}.`
            })
        } else {
            let user = await UserController.getUserById(interaction.user.id);

            if(!user) user = await UserController.createUser({ userId: interaction.user.id});

            if(Number(user.coins) < RaffleManager.rafflePrice * ammount) return await interaction.reply({ content: `${botConfig.NERVOUS} | <@${user.userId}>, Você não tem ${botConfig.cashname.toLowerCase()} o suficiente para isto.`})
        
            await UserController.removeCash(user, {
                from: user.userId,
                to: "comprando riffas",
                ammount: RaffleManager.rafflePrice * ammount
            });

            RaffleManager.addPlayer(user.userId as string, ammount);
            await interaction.reply({ content: `${botConfig.OK} | <@${interaction.user.id}>, Você comprou **${ammount} Tickets** por ${botConfig.getCashString(ammount * RaffleManager.rafflePrice)}.`});
        }
    }

}