const Discord = require('discord.js');
const { Manager } = require('moonlink.js')
const config = require('./config/config.json')
const fs = require('fs');
const { clearTimeout } = require('timers');
require('colors')
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.GuildExpressions,
    ],
    partials: [Discord.Partials.User, Discord.Partials.Channel, Discord.Partials.GuildMember, Discord.Partials.Message, Discord.Partials.Reaction]
})

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.color = config.color;
client.config = config
client.manager = new Manager({
  // Configura el server de LavaLink al que te tienes que conectar
  nodes: [
    {
      identifier: 'sonicbot',
      host: config.lavalink.host,         // El host name de tu server de lavalink
      port: config.lavalink.port,         // El puerto que tu server esta leyendo
      password: config.lavalink.password, // La contraseña para tu server de Lavalink
      secure: config.lavalink.secure,     // Elige que tipo de conexión usas
    },
  ],
  sendPayload: (guildId, payload) => {
    const guild = client.guilds.cache.get(guildId);
    if (guild) guild.shard.send(JSON.parse(payload));
  },
  autoPlay: true,
  // Opciones adicionales
  options: {
    // Deshabilita los plugins nativos de Spotify/YouTube en moonlink.js
    // para que todas las búsquedas pasen por LavaSrc en Lavalink
    disableNativeSources: true,
  },
});

client.manager.on('nodeConnected', (node) => {
  console.log(`Node ${node.identifier} connected`);
});

client.manager.on('nodeDisconnect', (node) => {
  console.log(`Node ${node.identifier} disconnected`);
});

client.manager.on('debug', (d) => console.log(d))

client.manager.on('nodeError', (node, error) => {
  console.error(`Node ${node.identifier} encountered an error:`, error);
});

// Playback events
client.manager.on('trackStart', (player, track) => {
  // Envia un mensaje cuando hay una canción sonando
  const channel = client.channels.cache.get(player.textChannelId);
  if (channel) {
    channel.send(`🎧 Ahora suena: **${track.title} - ${track.author}**  🎧`);
  }
});

client.manager.on('queueEnd', async (player) => {
  // Envia un mensaje cuando la cola termina
  const channel = client.channels.cache.get(player.textChannelId)
  if (channel) {
    let countdown = 30
    let msg

    try {
      msg = await channel.send(`❌🎧 **¡Cola terminada!** Desconectando en \`${countdown}s\` si no se añaden nuevas canciones. 🎧❌`);
    } catch (err) {
      console.error('No pude enviar el mensaje de countdown:', err)
      return;
    }

    const interval = setInterval(async () => {
      if (player.playing || player.queue.size > 0) {
        clearInterval(interval)
        clearTimeout(timeout)
        try { await msg.delete(); } catch {}
        return
      }
      countdown--
      if (countdown > 0) {
        try {
          await msg.edit(`❌🎧 **¡Cola terminada!** Desconectando en \`${countdown}s\` si no se añaden nuevas canciones. 🎧❌`)
        } catch (err) {
          console.error('Error al editar el mensaje de countdown:', err)
        }
      } else {
          clearInterval(interval)
          clearTimeout(timeout)
        try {
          await msg.delete()
        } catch (err) {
          console.error('Error al borrar el mensaje de countdown:', err)
        }
      }
    }, 1000)
  }  
  
  // Se desconecta si no se añaden nuevas canciones
  // Esto ayuda a ahorrar recursos
  const timeout = setTimeout(() => {
    if (!player.playing && player.queue.size === 0) {
      player.destroy()
      if (channel) {
        channel.send('❌🎧 ¡Desconectado por Inactividad! 🎧❌')
      }
    }
  }, 30000)
});

fs.readdirSync('./handlers').forEach(handler => {
    try {
        require(`./handlers/${handler}`)(client, Discord);
    } catch (e) {
        console.log(`ERROR EN EL HANDLER ${handler}`.red)
        console.log(e)
    }
});

client.on('raw', (packet) => {
  client.manager.packetUpdate(packet);
});

client.login(config.token).catch(() => console.log(`-[X]- NO HAS ESPECIFICADO UN TOKEN VALIDO O TE FALTAN INTENTOS -[X]-\n [-] ACTIVA LOS INTENTOS EN https://discord.dev [-]`.red))