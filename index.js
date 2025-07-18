const Discord = require('discord.js');
const { Manager } = require('moonlink.js')
const config = require('./config/config.json')
const fs = require('fs');
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

client.manager.on('trackEnd', (player, track) => {
  console.log(`Canción finalizada: ${track.title}`);
});

client.manager.on('queueEnd', async (player) => {
  // Envia un mensaje cuando la cola termina
  const channel = client.channels.cache.get(player.textChannelId);
  if (channel) {
    let i = 30
    const message = await channel.send(`❌🎧 **¡Cola terminada!** Desconectando en \`30s\` si no se añaden nuevas canciones. 🎧❌`)
    const msg = await channel.messages.fetch(message.id)
    setInterval(() => {
      if (i >= 1) {
        i--
        msg.edit(`❌🎧 **¡Cola terminada!** Desconectando en \`${i}s\` si no se añaden nuevas canciones. 🎧❌`)
      }
    }, 1000)
    if (i < 1) {
      msg.delete() 
    }
  }
  
  // Se desconecta si no se añaden nuevas canciones
  // Esto ayuda a ahorrar recursos
  setTimeout(() => {
    if (!player.playing && player.queue.size === 0) {
      player.destroy();
      if (channel) {
        channel.send('❌🎧 ¡Desconectado por Inactividad! 🎧❌');
      }
    }
  }, 30000); // 30 seconds
});

fs.readdirSync('./handlers').forEach(handler => {
    try {
        require(`./handlers/${handler}`)(client, Discord);
    } catch (e) {
        console.log(`ERROR EN EL HANDLER ${handler}`.red)
        console.log(e)
    }
});

// Handle raw events for voice state updates
// This is crucial for Moonlink.js to work properly
client.on('raw', (packet) => {
  client.manager.packetUpdate(packet);
});

client.login(config.token).catch(() => console.log(`-[X]- NO HAS ESPECIFICADO UN TOKEN VALIDO O TE FALTAN INTENTOS -[X]-\n [-] ACTIVA LOS INTENTOS EN https://discord.dev [-]`.red))