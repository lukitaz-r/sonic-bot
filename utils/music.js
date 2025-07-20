const { EmbedBuilder } = require('discord.js')

/**
 * Verifica que el usuario esté en un canal de voz.
 * Si no, envía el mensaje de error y devuelve null.
 */
function ensureVoice(message) {
  if (!message) return null
  const vc = message.member.voice.channel
  if (!vc) {
    message.reply({content: '❌ ¡Necesitas estar en un canal de voz primero! ❌', ephemeral: true})
    return null
  }
  return vc
}

/**
 * Crea o devuelve el player de LavaLink.
 */
function createPlayer(client, guildId, voiceChannelId, textChannelId) {
  const player = client.manager.players.create({
    guildId,
    voiceChannelId,
    textChannelId
  })
  player.connect({ setDeaf: true })
  return player
}

/**
 * Realiza la búsqueda en YouTube Music.
 */
async function searchMusic(client, query, requesterId) {
  return client.manager.search({
    query,
    requester: requesterId,
    source: 'ytmsearch'
  })
}

/**
 * Añade toda la playlist a la cola y envía embed de confirmación.
 */
async function enqueuePlaylist(player, searchResult, message = false, interaction = false) {
  const { tracks, playlistInfo } = searchResult
  player.queue.add(tracks)

  if (message) {
    return message.reply({
      embeds: [ buildEmbed({
        title: '✅ Playlist añadida',
        description: `**${playlistInfo.name}** (${tracks.length} temas) en la cola.\n> Solicitada por <@${tracks[0].requestedBy.id}>`,
        thumbnail: tracks[0].artworkUrl
      }) ]
    })
  }

  if (interaction) {
    await interaction.deferReply()
    await interaction.editReply({
      embeds: [ buildEmbed({
        author: 'Sonic Radio',
        title: '✅ Playlist añadida',
        description: `**${playlistInfo.name}** (${tracks.length} temas) en la cola.\n> Solicitada por <@${tracks[0].requestedBy.id}>`,
        thumbnail: tracks[0].artworkUrl
      }) ]
    })
  }
}

/**
 * Añade un único track a la cola y envía embed de confirmación.
 */
async function enqueueTrack(player, track, message = false, interaction = false) {
  player.queue.add(track)
  if (message) {
    return message.reply({
      embeds: [ buildEmbed({
        author: 'Sonic Radio',
        title: '✅ Canción añadida',
        description: `[${track.title}](${track.url}) — ${track.author}\n> Solicitada por <@${track.requestedBy.id}>`,
        thumbnail: track.artworkUrl
      }) ]
    })
  }
  if (interaction) {
    await interaction.deferReply()
    await interaction.editReply({
      embeds: [ buildEmbed({
        author: 'Sonic Radio',
        title: '✅ Canción añadida',
        description: `[${track.title}](${track.url}) — ${track.author}\n> Solicitada por <@${track.requestedBy.id}>`,
        thumbnail: track.artworkUrl
      }) ]
    })
  }
}

/**
 * Construye un EmbedBuilder a partir de un objeto de configuración.
 */
function buildEmbed({ author, title, description, thumbnail, color = 'Blurple' }) {
  const e = new EmbedBuilder()
  if (author) e.setAuthor({ name: author })
  if (title) e.setTitle(title)
  if (description) e.setDescription(description)
  if (thumbnail) e.setThumbnail(thumbnail)
  e.setColor(color)
  return e
}

const formatDuration = (ms) => {
  const seconds = Math.floor((ms / 1000) % 60)
  const minutes = Math.floor((ms / (1000 * 60)) % 60)
  const hours = Math.floor(ms / (1000 * 60 * 60))
  return `${hours ? `${hours}:` : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

module.exports = {
  ensureVoice,
  createPlayer,
  searchMusic,
  enqueuePlaylist,
  enqueueTrack,
  buildEmbed,
  formatDuration
}