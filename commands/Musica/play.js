const { SlashCommandBuilder } = require('discord.js');
const { createPlayer, searchMusic, enqueuePlaylist, enqueueTrack, ensureVoice, buildEmbed } = require('../../utils/music');

module.exports = {
  name: 'play',
  aliases: ['escuchar', 'ponla', 'dj'],
  desc: '🎧 ¡Pon un temita!',
  slashBuilder: new SlashCommandBuilder()
    .setName("play")
    .setDescription("🎧 ¡Pon un temita!")
    .addStringOption(opt =>
      opt.setName("entrada")
        .setDescription("🎧 Un link valido (de Spotify, YouTube o Deezer) o el nombre de la canción.")
        .setRequired(true)
    )
    .addIntegerOption(opt =>
      opt.setName("posición")
        .setDescription("🎧 Posición en la que será asignada el tema dentro de la cola.")
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
      input = ctx.options.getString("entrada", true)
    }

    if (message) {
      input = args.join(' ');
    }

    // 1. Asegurarse de que el usuario está en un canal de voz
    const voiceChannel = ensureVoice(ctx);
    if (!voiceChannel) return;

    // 2. Crear/obtener el player de Lavalink
    const player = createPlayer(client, ctx.guild.id, voiceChannel.id, ctx.channel.id);

    // 3. Realizar la búsqueda
    const searchResult = await searchMusic(client, input, user.id);

    if (!searchResult.tracks.length) {
      return ctx.reply({ embeds: [ buildEmbed({
        author: 'Sonic Radio',
        title: '❌ No se encontraron resultados. ❌',
        description: '> Surgió un problema al intentar encontrar el track.',
        color: 'Red'
      }) ]});
    }

    // 4. Gestionar los distintos tipos de resultado
    switch (searchResult.loadType) {
      case 'playlist':
        await enqueuePlaylist(player, searchResult, message, interaction);
        break;
      case 'track':
      case 'search':
        await enqueueTrack(player, searchResult.tracks[0], message, interaction);
        break;
      case 'empty':
        return ctx.reply('❌ No hay coincidencias para tu búsqueda. ❌');
      case 'error':
        return ctx.reply(`❌ Error al cargar: ${searchResult.error || 'Desconocido'} ❌`);
    }

    // 5. Iniciar reproducción si aún no está sonando
    if (!player.playing) {
      await player.play();
    }
  }
}