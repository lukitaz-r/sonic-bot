const { SlashCommandBuilder } = require('discord.js');
const { ensureVoice, buildEmbed } = require('../../utils/music');

module.exports = {
  name: 'stop',
  aliases: ['para', 'basta'],
  desc: '🎧 ¡Termina la radio!',
  slashBuilder: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("🎧 ¡Termina la radio!"),

  /**
   * Ejecuta el comando play.
   * @param client Instancia del cliente de Discord
   * @param message Mensaje que invocó el comando
   * @param args Argumentos del comando
   * @param prefix Prefijo utilizado
   * @param interaction Interacción de slash command
   */

  async run(
    client,
    message,
    args,
    prefix,
    interaction
  ) {
    const ctx = message || interaction;
    const user = message.author || interaction.user;
    
    const voiceChannel = ensureVoice(ctx);
    if (!voiceChannel) return

    const player = client.manager.players.get(ctx.guild.id)

    if (message) {
      if (!player) {
        return ctx.reply({
          embeds: [
            new buildEmbed({
              author: 'Sonic Radio',
              title: "❌🎧 No hay una radio activa en el servidor",
              description: `> Si quieres escuchar musica, pon \`${prefix}play [cancion]\` o \`/play\``,
              thumbnail: client.user.avatarUrl,
              color: 'Red'
            })
          ]
        })
      }

      if (ctx.member.voice.channel?.id !== player.voiceChannelId) {
        return ctx.reply({
          embeds: [
            new buildEmbed({
              author: 'Sonic Radio',
              title: "❌🎧 Debes estar en el mismo VC del bot",
              description: `> Así no funcionan las cosas...`,
              thumbnail: client.user.avatarUrl,
              color: 'Red'
            })
          ]
        })
      }

      if (!player.current) {
        return ctx.reply({
          embeds: [
            new buildEmbed({
              author: 'Sonic Radio',
              title: "❌🎧 No hay nada sonando ahora",
              description: `> Si quieres escuchar musica, pon \`${prefix}play [cancion]\` o \`/play\'`,
              thumbnail: client.user.avatarUrl,
              color: 'Red'
            })
          ]
        })
      }
      
      ctx.reply({
        embeds: [
          new buildEmbed({
            author: 'Sonic Radio',
            title: "🖐️ Radio terminada",
            description: `Sesión concluida por <@${user.id}>`,
            thumbnail: user.avatarUrl,
            color: 'Orange'
          })
        ]
      })
    }

    if (interaction) {
      await ctx.deferReply()
      if (!player) {
        return ctx.editReply({
          embeds: [
            new buildEmbed({
              author: 'Sonic Radio',
              title: "❌🎧 No hay una radio en el servidor ahora mismo",
              description: `> Si quieres escuchar musica, pon \`${prefix}play [cancion]\` o \`/play\'`,
              thumbnail: client.user.avatarUrl,
              color: 'Red'
            })
          ]
        })
      }

      if (ctx.member.voice.channel?.id !== player.voiceChannelId) {
        return ctx.editReply({
          embeds: [
            new buildEmbed({
              author: 'Sonic Radio',
              title: "❌🎧 Debes estar en el mismo VC del bot",
              description: `> Así no funcionan las cosas...`,
              thumbnail: client.user.avatarUrl,
              color: 'Red'
            })
          ]
        })
      }

      if (!player.current) {
        return ctx.editReply({
          embeds: [
            new buildEmbed({
              author: 'Sonic Radio',
              title: "❌🎧 No hay nada sonando ahora",
              description: `> Si quieres escuchar musica, pon \`${prefix}play [cancion]\` o \`/play\'`,
              thumbnail: client.user.avatarUrl,
              color: 'Red'
            })
          ]
        })
      }

      await ctx.editReply({
        embeds: [
          new buildEmbed({
            author: 'Sonic Radio',
            title: "🖐️ Radio terminada",
            description: `> Sesión concluida por <@${user.id}>`,
            thumbnail: user.avatarUrl,
            color: 'Orange'
          })
        ]
      })
    }
  
    player.queue.clear()
    return player.stop()
  }
}