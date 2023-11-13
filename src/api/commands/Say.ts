import { CacheType, ChannelType, CommandInteraction, SlashCommandBuilder, TextChannel } from "discord.js";
import Command from "./Command";


export default abstract class Say extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName("text")
                .setDescription("Sua mensagem, mestre")
                .setRequired(true))
        .setName("say")
        .setDescription("Anunciar algo para os usuários nos servers")

    static async execute(interaction: CommandInteraction<CacheType>) {

        await interaction.deferReply({});
        const message = interaction.options.get("text").value as string;

        if(message.length <= 2) {
            return await interaction.editReply({ content: "Digite uma mensagem válida" });
        }

        if(!(interaction.user.id === "274553417685270528")) return await interaction.editReply({ content: "Você não tem permissão para isso."});

        await interaction.editReply({ content: "Enviando aviso aos servidores..." })

        
        interaction.client.guilds.cache.map(async (guild) => {

            const defaultChannel = (await guild.channels.fetch()).filter((channel) => channel.type == ChannelType.GuildText).first();

            const channel = defaultChannel as TextChannel;

            if(channel)
                await channel.send(message);

        });

        await interaction.editReply({ content: `> Aviso enviado para todos os servidores.` })
    }

}