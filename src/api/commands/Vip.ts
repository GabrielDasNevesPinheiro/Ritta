import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { botConfig } from "../../app";

export default class Vip extends Command {

    static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("vip")
        .setDescription("Torne-se um usuário VIP");

    static async execute(interaction: CommandInteraction) {

        let invite = "https://discord.com/invite/48zfhnJ954";

        let embed = new EmbedBuilder().setTitle("Benefícios VIP")
            .setDescription("Não quer mais ter que lidar com taxas? Ou quer ganhar mais pontos em resgate e tarefas? Compre o VIP por um precinho camarada. Para adquirir basta entrar no meu servidor oficial clicando no botão abaixo.\nConfere aí os benefícios do VIP:")
            .addFields({
                name: "BENEFÍCIOS", value: `* Cargo Exclusivo no meu [servidor](${invite})\n* **Sorteios** e **Drops** Exclusivos\n* Tarefas com **melhores recompensas**\n* **Sem taxa** econômica\n* Tem **5%** de chances em apostas\n* **${botConfig.vipPassiveEarning} ${botConfig.cashname.toLowerCase()}** por minuto\n* Pode escolher o **emoji** que quiser (coinflip)\n
            `}).setTimestamp(new Date()).setColor(Colors.White);

        let mention = await botConfig.mention(interaction.user.id);

        let button = new ButtonBuilder()
            .setLabel(`Comprar (R$ ${botConfig.vipPrice.toFixed(2).replace('.', ',')})`)
            .setURL(invite)
            .setStyle(ButtonStyle.Link)

        let row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

        await interaction.reply({ content: `${mention}`, embeds: [embed], components: [row] });
    }

}