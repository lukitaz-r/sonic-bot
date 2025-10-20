const { SlashCommandBuilder } = require('discord.js');
const { createPlayer, searchMusic, enqueuePlaylist, enqueueTrack, ensureVoice, buildEmbed } = require('../../utils/music');

module.exports = {
  name: 'volume',
  aliases: ['vol', 'v'],
  desc: '🎧 Cambia el volumen de la radio',
  slashBuilder: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("🎧 Cambia el volumen de la radio")
    .addIntegerOption(opt =>
      opt.setName("numero")
        .setDescription("🎧 número del 1 al 1000.")
        .setRequired(true)
    ),

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
    // Determina el contexto (mensaje o slash)
    const ctx = message || interaction;
    const user = message.author || interaction.user;
    let input
    if (interaction) {
      input = ctx.options.getInteger("numero", true)
    }

    if (message) {
      input = args[0];
    }

    const volume = parseInt(input)

    // 1. Asegurarse de que el usuario está en un canal de voz
    const voiceChannel = ensureVoice(ctx);
    if (!voiceChannel) return;

    // 2. Crear/obtener el player de Lavalink
    const player = client.manager.players.get(ctx.guild.id);

    if (message) {
      if (!player) {
        return ctx.reply({
          embeds: [
            new buildEmbed({
              author: 'Sonic Radio',
              title: "❌🎧 No hay una radio activa en el servidor",
              description: `> Si quieres escuchar musica, pon \`${prefix}play [cancion]\` o \`/play\``,
              thumbnail: client.user.avatarURL(),
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
              thumbnail: client.user.avatarURL(),
              color: 'Red'
            })
          ]
        })
      }

      if (!player?.current) {
        return ctx.reply({
          embeds: [
            new buildEmbed({
              author: 'Sonic Radio',
              title: "❌🎧 No hay nada sonando ahora",
              description: `> Si quieres escuchar musica, pon \`${prefix}play [cancion]\` o \`/play\``,
              thumbnail: client.user.avatarURL(),
              color: 'Red'
            })
          ]
        })
      }

      if (isNaN(volume)) {
        return ctx.reply({
          embeds: [
            new buildEmbed({
              author: 'Sonic Radio',
              title: "❌🎧 Número invalido",
              description: `> Por favor, introduzca un valor válido entre 1 y 100.`,
              thumbnail: client.user.avatarURL(),
              color: 'Red'
            })
          ]
        })
      }

      if (volume < 0 || volume > 1000) {
        return ctx.reply({
          embeds: [
            new buildEmbed({
              author: 'Sonic Radio',
              title: "❌🎧 Número invalido",
              description: `> Por favor, introduzca un valor válido entre 1 y 100.`,
              thumbnail: client.user.avatarURL(),
              color: 'Red'
            })
          ]
        })
      }

      ctx.reply({
        embeds: [
          new buildEmbed({
            author: 'Sonic Radio',
            title: "➕ Volumen Cambiado",
            description: `> Se ajustó el volumen a ${volume}`,
            thumbnail: user.avatarURL(),
            color: 'Green'
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
              description: `> Si quieres escuchar musica, pon \`${prefix}play [cancion]\` o \`/play\``,
              thumbnail: client.user.avatarURL(),
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
              thumbnail: client.user.avatarURL(),
              color: 'Red'
            })
          ]
        })
      }

      if (!player?.current) {
        return ctx.editReply({
          embeds: [
            new buildEmbed({
              author: 'Sonic Radio',
              title: "❌🎧 No hay nada sonando ahora",
              description: `> Si quieres escuchar musica, pon \`${prefix}play [cancion]\` o \`/play\``,
              thumbnail: client.user.avatarURL(),
              color: 'Red'
            })
          ]
        })
      }

      if (isNaN(volume)) {
        return ctx.editReply({
          embeds: [
            new buildEmbed({
              author: 'Sonic Radio',
              title: "❌🎧 Número invalido",
              description: `> Por favor, introduzca un valor válido entre 1 y 1000.`,
              thumbnail: client.user.avatarURL(),
              color: 'Red'
            })
          ]
        })
      }

      if (volume < 0 || volume > 1000) {
        return ctx.editReply({
          embeds: [
            new buildEmbed({
              author: 'Sonic Radio',
              title: "❌🎧 Número invalido",
              description: `> Por favor, introduzca un valor válido entre 1 y 1000.`,
              thumbnail: client.user.avatarURL(),
              color: 'Red'
            })
          ]
        })
      }

      ctx.editReply({
        embeds: [
          new buildEmbed({
            author: 'Sonic Radio',
            title: "➕ Volumen Cambiado",
            description: `> Se ajustó el volumen a ${volume}`,
            thumbnail: user.avatarURL(),
            color: 'Green'
          })
        ]
      })
    }

    player.setVolume(volume)
  }
}