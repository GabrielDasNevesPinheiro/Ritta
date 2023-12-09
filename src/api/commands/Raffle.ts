import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, CommandInteraction, ComponentType, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { getIntegerOption } from "../../util/InteractionUtils";
import { botConfig } from "../../app";
import RaffleManager from "../../util/RaffleManager";
import UserController from "../../database/controllers/UserController";

export default class Raffle extends Command {
    
    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("raffle")
        .addIntegerOption(option => 
                option.setName("ammount")
                .setDescription("Quantidade de tickets para comprar")
                .setMinValue(1)
            )
        .setDescription("Compre tickets para a rifa ou veja informações do sorteio");

    static async execute(interaction: CommandInteraction) {
        
        let ammount = interaction.options.get("ammount")?.value as number;

        if(isNaN(ammount)) {

            let stats = RaffleManager.getStats();

            let info = new ButtonBuilder()
                .setLabel("Informações do vencedor")
                .setDisabled(!RaffleManager.lastWinner)
                .setCustomId("info")
                .setStyle(ButtonStyle.Secondary)
            
            let players = new ButtonBuilder()
            .setLabel("Participantes")
            .setCustomId("players")
            .setDisabled(RaffleManager.getStats().players <= 0)
            .setStyle(ButtonStyle.Primary)
            let row = new ActionRowBuilder<ButtonBuilder>().addComponents(players, info);

            let response = await interaction.reply({
                content: `# Rifa do ${botConfig.name}\n${botConfig.CASH} | Prêmio: ${botConfig.getCashString(stats.price).replace(`${botConfig.CASH}`, ``)}\n:tickets: | Tickets: ${stats.tickets}\n:busts_in_silhouette: | Participantes: ${stats.players} \n:hourglass: | Finaliza em: <t:${stats.endTime}> (<t:${stats.endTime}:R>)\n` +
                (RaffleManager.lastWinner ? `# Último Ganhador\n## **${interaction.client.users.cache.get(String(RaffleManager.lastWinner.userId)).username}** - (${botConfig.getCashString(RaffleManager.lastWinnerWon)})` : `# Sem informações de um último ganhador.` ) + "\n" +
                `:information_source: Para participar compre tickets utilizando este mesmo comando. Cada ticket custa ${botConfig.getCashString(RaffleManager.rafflePrice)}.`,
                components: [row]
            });


            const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 30000 });
            let page = 0;
            let maxPerPage = 10;
            let inGame = RaffleManager.getInGamePlayers();
            

            collector.on("collect", async (confirmation) => {

                if(confirmation.customId === "info") {
                    let embed = new EmbedBuilder().setTitle("Informações do último vencedor")
                    .setDescription(
                        `**:tada: Vencedor:** ${confirmation.client.users.cache.get(String(RaffleManager.lastWinner.userId)).username}\n` +
                        `**:money_with_wings: Apostou:** ${botConfig.getCashString(RaffleManager.lastWinnerTickets * RaffleManager.rafflePrice)}\n` +
                        `**:trophy: Ganhou:** ${botConfig.getCashString(RaffleManager.lastWinnerWon) }\n`
                        ).setTimestamp(new Date()).setColor(Colors.Green);

                        await interaction.followUp({ embeds: [embed], ephemeral: true });
                        return;
                }

                if(confirmation.customId === "players") {
                    
                    let str = "";

                    inGame.forEach((gaming) => {
                        str += '`' + `${interaction.client.users.cache.get(String(gaming)).username}` + '` '
                    });

                    await interaction.followUp({ content: `> **Participantes da Rifa**\n`+str, ephemeral: true });
                    await confirmation.update({});
                    return;
                    
                }

            });

        } else {
            let user = await UserController.getUserById(interaction.user.id);

            if(!user) user = await UserController.createUser({ userId: interaction.user.id});

            if(Number(user.coins) < RaffleManager.rafflePrice * ammount) return await interaction.reply({ content: `${botConfig.NERVOUS} | <@${user.userId}>, Você não tem ${botConfig.cashname.toLowerCase()} o suficiente para isto.`})
        
            await UserController.removeCash(user, {
                from: user.userId,
                to: "comprando rifas",
                ammount: RaffleManager.rafflePrice * ammount
            });

            RaffleManager.addPlayer(user.userId as string, ammount);

            

            await interaction.reply({ content: `${botConfig.OK} | <@${interaction.user.id}>, Você comprou **${ammount} Tickets** por ${botConfig.getCashString(ammount * RaffleManager.rafflePrice)}.` });

            
        }
    }

}