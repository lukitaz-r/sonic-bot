const { EmbedBuilder } = require('discord.js')

module.exports = {
  name: "kick",
  aliases: ["kickear", "expulsar"],
  desc: "Sirve para expulsar a un usuario del Servidor",
  slashBuilder: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("🔨 ¡Expulsa a alguien no deseado!")
    .addStringOption(opt =>
      opt.setName("objetivo")
        .setDescription("🔨 El usuario que deseas expulsar (ID o Mención).")
        .setRequired(true)
    ),
  permisos: ["KickMembers"],
  permisos_bot: ["KickMembers"],
  run: async (client, message, args, prefix, interaction) => {
    const ctx = interaction ?? message
    const usuario = ctx.guild.members.cache.get(args[0]) || ctx.mentions.members.first()
    if (!usuario) return ctx.reply("❌ **No se ha encontrado al usuario que has especificado!**")
    let razon = args.slice(1).join(" ") || "No se ha especificado ninguna razón!"
    if (usuario.id === ctx.guild.ownerId) return ctx.reply("❌ **No puedes expulsar al DUEÑO del Servidor!**")


    if (message) {
    

      const botRole = ctx.guild.members.me.roles.highest
      const userRole = usuario.roles.highest
      const authorRole = ctx.member.roles.highest

      if (botRole.position <= userRole.position)
        return ctx.reply("❌ **Mi Rol está por __debajo__ del usuario que quieres expulsar!**")

      if (authorRole.position <= userRole.position)
        return ctx.reply("❌ **Tu Rol está por __debajo__ del usuario que quieres expulsar!**")

      try {
        await usuario.send({
          embeds: [
            new EmbedBuilder()
              .setTitle(`Has sido expulsado de __${ctx.guild.name}__`)
              .setDescription(`**Razón:** \`\`\`yml\n${razon}\`\`\``)
              .setColor(client.color)
              .setTimestamp()
          ]
        }).catch(() => ctx.reply("No se le ha podido enviar el DM al usuario!"))

        await usuario.kick(razon)

        return ctx.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle(`✅ Usuario Expulsado ✅`)
              .setDescription(`**Se ha expulsado exitosamente a \`${usuario.user.tag}\` *(\`${usuario.id}\`)* del servidor!**`)
              .addFields([{ name: "Razón", value: `\`\`\`yml\n${razon}\n\`\`\`` }])
              .setColor(client.color)
              .setTimestamp()
          ]
        })
      } catch (error) {
        return ctx.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("❌ No he podido expulsar al usuario!")
              .setColor("FF0000")
          ]
        })
      }
    }
    
  }
}
