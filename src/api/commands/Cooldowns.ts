import { CacheType, Colors, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import UserController from "../../database/controllers/UserController";
import { botConfig } from "../../app";
import { cooldownCheck, dailyCooldownCheck } from "../../util/DateUtils";

export class Cooldowns extends Command {
    
    public static command: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("cooldowns")
        .addUserOption(option => 
                option.setName("user")
                .setDescription("Selecione o usuário")
            )
        .setDescription("Exibe os tempos de recarga do usuário")
    
    public static async execute(interaction: CommandInteraction<CacheType>) {

        let userId = interaction.options.getUser("user")?.id || interaction.user.id;

        let user = await UserController.getUserById(userId);

        if(!user) {
            return await interaction.reply({ content: `${botConfig.CONFUSED} Não encontrei este usuário.`});
        }

        let dailyCooldown = dailyCooldownCheck(24, user.dailydate, true);
        let weeklyCooldown = cooldownCheck(168, user.weeklydate);
        let workCooldown = cooldownCheck(2, user.workdate);
        let crimeCooldown = cooldownCheck(1, user.crimedate);
        let boosterCooldown = cooldownCheck(360, user.boosterDate);
        let vipCooldown = cooldownCheck(720, user.vipDate);

        let dailyString = dailyCooldown.allowed ? `${botConfig.OK} Disponível.` : `${botConfig.WAITING} ` + `<t:${dailyCooldown.time}:R>`;
        let workString = workCooldown.allowed ? `${botConfig.OK} Disponível.` : `${botConfig.WAITING} ` + `<t:${workCooldown.time}:R>`;
        let crimeString = crimeCooldown.allowed ? `${botConfig.OK} Disponível.` : `${botConfig.WAITING} ` + `<t:${crimeCooldown.time}:R>`;
        let weeklyString = weeklyCooldown.allowed ? `${botConfig.OK} Disponível.` : `${botConfig.WAITING} ` + `<t:${weeklyCooldown.time}:R>`;
        let vipString = !vipCooldown.allowed ? `${botConfig.VIP_YES} Válido até <t:${vipCooldown.time}:d>` : `${botConfig.VIP_NO} Desativado. `;
        let boosterString = !boosterCooldown.allowed ? `${botConfig.VIP_YES} Válido até <t:${boosterCooldown.time}:d>` : `${botConfig.VIP_NO} Desativado. `;

        

        let embed = new EmbedBuilder()
            .setTitle(`${botConfig.WAITING} Tempos de Espera`)
            .setDescription(`> Esses são os cooldowns de <@${userId}>`)
            .addFields([
                { name: "Diário", value: dailyString, inline: true },
                { name: "Trabalho", value: workString, inline: true },
                { name: "Crime", value: crimeString, inline: true },
                { name: "Semanal", value: weeklyString, inline: true },
                { name: "VIP", value: vipString, inline: true },
                { name: "Server Booster", value: boosterString, inline: true },
                { name: "Voto", value: `${botConfig.CRYING} Em manutenção.`, inline: true },
            ]).setThumbnail(`${botConfig.IMG_TIME}`).setTimestamp(new Date()).setColor(Colors.White);

        await interaction.reply({ embeds: [embed]});

    }
}