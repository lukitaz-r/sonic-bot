const { SlashCommandBuilder } = require('discord.js');
const { createPlayer, searchMusic, enqueuePlaylist, enqueueTrack, ensureVoice, buildEmbed } = require('../../utils/music');

module.exports = {
  name: 'loop',
  aliases: ['bucle', 'l'],
  desc: '🎧 Pon en bucle la musica, para que la fiesta no pare.',
  slashBuilder: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("🎧 Pon en bucle la musica, para que la fiesta no pare.")
    .addStringOption(opt =>
      opt.setName("modo")
        .setDescription("🎧 no | cancion | lista.")
        .setRequired(false)
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
      input = ctx.options.getString("modo", true)
    }

    if (message) {
      input = args[0];
    }

    if (!input || !input.length) {
      if (player.loop === 'none') {
        player.setLoop('track');
        return message.reply('Track loop enabled.');
      } else {
        player.setLoop('none');
        return message.reply('Loop disabled.');
      }
    }

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

      if (!input || !input.length) {
        if (player.loop === 'none') {
          player.setLoop('track');
          return ctx.reply({
            embeds: [
              new buildEmbed({
                author: 'Sonic Radio',
                title: "♻️ Estado del Loop",
                description: `> Se empezó el loop de la canción.`,
                thumbnail: user.avatarURL(),
                color: 'Green'
              })
            ]
          });
        } else {
          player.setLoop('none');
          return ctx.reply({
            embeds: [
              new buildEmbed({
                author: 'Sonic Radio',
                title: "♻️ Estado del Loop",
                description: `> Se terminó el loop.`,
                thumbnail: user.avatarURL(),
                color: 'Green'
              })
            ]
          });
        }
      }

      switch (input) {
        case 'none':
        case 'off':
        case 'disable':
        case 'no':
        case 'desactivar':
        case 'terminar':
        case '0':
          player.setLoop('none');
          return ctx.reply({
            embeds: [
              new buildEmbed({
                author: 'Sonic Radio',
                title: "♻️ Estado del Loop",
                description: `> Se empezó el loop de la canción.`,
                thumbnail: user.avatarURL(),
                color: 'Green'
              })
            ]
          });
          
        case 'track':
        case 'song':
        case 'current':
        case 'cancion':
        case 'actual':
        case 'si':
        case 'empezar':
        case '1':
          player.setLoop('track');
          return ctx.reply({
            embeds: [
              new buildEmbed({
                author: 'Sonic Radio',
                title: "♻️ Estado del Loop",
                description: `> Se empezó el loop de la canción.`,
                thumbnail: user.avatarURL(),
                color: 'Green'
              })
            ]
          });
          
        case 'queue':
        case 'all':
        case 'todos':
        case 'lista':
        case '2':
          player.setLoop('queue');
          return ctx.reply({
            embeds: [
              new buildEmbed({
                author: 'Sonic Radio',
                title: "♻️ Estado del Loop",
                description: `> Se empezó el loop de la lista.`,
                thumbnail: user.avatarURL(),
                color: 'Green'
              })
            ]
          });
          
        default:
          return ctx.reply({
            embeds: [
              new buildEmbed({
                author: 'Sonic Radio',
                title: "♻️ Estado del Loop",
                description: `> ¡Modo invalido! Use: \`no\`, \`cancion\`, o \`lista\`.`,
                thumbnail: user.avatarURL(),
                color: 'Red'
              })
            ]
          });
      }
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

      if (!input || !input.length) {
        if (player.loop === 'none') {
          player.setLoop('track');
          return ctx.editReply({
            embeds: [
              new buildEmbed({
                author: 'Sonic Radio',
                title: "♻️ Estado del Loop",
                description: `> Se empezó el loop de la canción.`,
                thumbnail: user.avatarURL(),
                color: 'Green'
              })
            ]
          });
        } else {
          player.setLoop('none');
          return ctx.editReply({
            embeds: [
              new buildEmbed({
                author: 'Sonic Radio',
                title: "♻️ Estado del Loop",
                description: `> Se terminó el loop.`,
                thumbnail: user.avatarURL(),
                color: 'Green'
              })
            ]
          });
        }
      }

      switch (input) {
        case 'none':
        case 'off':
        case 'disable':
        case 'no':
        case 'desactivar':
        case 'terminar':
        case '0':
          player.setLoop('none');
          return ctx.editReply({
            embeds: [
              new buildEmbed({
                author: 'Sonic Radio',
                title: "♻️ Estado del Loop",
                description: `> Se empezó el loop de la canción.`,
                thumbnail: user.avatarURL(),
                color: 'Green'
              })
            ]
          });
          
        case 'track':
        case 'song':
        case 'current':
        case 'cancion':
        case 'actual':
        case 'si':
        case 'empezar':
        case '1':
          player.setLoop('track');
          return ctx.editReply({
            embeds: [
              new buildEmbed({
                author: 'Sonic Radio',
                title: "♻️ Estado del Loop",
                description: `> Se empezó el loop de la canción.`,
                thumbnail: user.avatarURL(),
                color: 'Green'
              })
            ]
          });
          
        case 'queue':
        case 'all':
        case 'todos':
        case 'lista':
        case '2':
          player.setLoop('queue');
          return ctx.editReply({
            embeds: [
              new buildEmbed({
                author: 'Sonic Radio',
                title: "♻️ Estado del Loop",
                description: `> Se empezó el loop de la lista.`,
                thumbnail: user.avatarURL(),
                color: 'Green'
              })
            ]
          });
          
        default:
          return ctx.editReply({
            embeds: [
              new buildEmbed({
                author: 'Sonic Radio',
                title: "♻️ Estado del Loop",
                description: `> ¡Modo invalido! Use: \`no\`, \`cancion\`, o \`lista\`.`,
                thumbnail: user.avatarURL(),
                color: 'Red'
              })
            ]
          });
      }
    }
  }
}