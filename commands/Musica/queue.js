const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ensureVoice, buildEmbed, formatDuration } = require('../../utils/music');

module.exports = {
  name: 'queue',
  aliases: ['cola', 'lista'],
  desc: '🎧 ¡Consulta la lista de canciones!',
  slashBuilder: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("🎧 ¡Consulta la lista de canciones!"),

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
    
    const voiceChannel = ensureVoice(ctx);
    if (!voiceChannel) return
    const player = client.manager.players.get(ctx.guild.id)
    
    const embed = new EmbedBuilder()
      .setAuthor({
        name: 'Sonic Radio'
      })
      .setTitle('📃 Lista de la Radio')
      .setColor('#0099ff')
      .setThumbnail(ctx.guild.iconURL({ dynamic: true }))
    
    if (player.current) {
      embed.setDescription(`**Ahora suena:**\n[${player.current.title}](${player.current.url}) - ${player.current.author} | \`${formatDuration(player.current.duration)}\``);
    }
    
    if (player.queue.size > 0) {
      const tracks = player.queue.tracks.map((track, index) => {
        return `${index + 1}. ${track.title} - ${track.author} | \`${formatDuration(track.duration)}\``;
      })
      
      embed.addFields([{
        name: 'Las que siguen:',
        value: tracks.slice(0, 10).join('\n'),
      }])
      
      if (player.queue.size > 10) {
        embed.addFields([{
          name: 'Y mas...',
          value: `${player.queue.size - 10} canciones mas en la cola.`,
        }]);
      }
    }

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
              thumbnail: client.user.avatarURL,
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
              thumbnail: client.user.avatarURL,
              color: 'Red'
            })
          ]
        })
      }

      if (!player.current && player.queue.size === 0) {
        return ctx.reply('**¡No hay canciones en espera!** 😅')
      }

      ctx.reply({
        embeds: [
          embed
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

      if (!player.current && player.queue.size === 0) {
        return ctx.reply('**¡No hay canciones en espera!** 😅')
      }

      await ctx.editReply({
        embeds: [
          embed
        ]
      })
    }
  }
}