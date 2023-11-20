import { CacheType, Colors, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { botConfig } from "../../app";
import Command from "./Command";
import moment from 'moment';

export default abstract class BotInfo extends Command {
    
    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("botinfo")
        .setDescription("Exibe informações sobre mim")
    
    static async  execute(interaction: CommandInteraction<CacheType>) {


        let data = moment(interaction.client.user.createdAt);
        let embed = new EmbedBuilder().setTitle(`${botConfig.name}`)
            .setDescription(`> Olá! Eu sou o ${botConfig.name}, um bot desenvolvido em Typescript por __<@340933138039439360>__ e planejado por __<@274553417685270528>__. Estou atualmente hospedado em servidores da __AWS__.`)
            .setThumbnail(botConfig.IMG_THEROCK)
            .addFields([
                { name: "Ajuda", value: "Use `/help` para ver meus comandos."},
                { name: `Usuários`, value: `${interaction.client.users.cache.size}`, inline: true },
                { name: `Servidores`, value: `${interaction.client.guilds.cache.size}`, inline: true },
                { name: `Canais`, value: `${interaction.client.channels.cache.size}`, inline: true },
                { name: "Fui criado", value: `<t:${data.unix()}>(<t:${data.unix()}:R>)`}
            ]).setColor(Colors.White).setTimestamp(new Date());

        await interaction.reply({ content: `<@${interaction.user.id}>`, embeds: [embed]});
    }
}