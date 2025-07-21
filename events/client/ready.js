const {REST, Routes, ActivityType, PresenceUpdateStatus} = require('discord.js')
const mongoose = require('mongoose')

let palo = 53

module.exports = {
  name: 'ready',
  once: true,
  run: (client) => {
    mongoose.connect(client.config.mongodb).then(() => {
        console.log(`
╔═════════════════════════════════════════════════════╗
║                                                     ║
║       Conectado a la base de datos de MONGODB!      ║
║                                                     ║
╚═════════════════════════════════════════════════════╝`.blue)
    }).catch((err) => {
        console.log(`☁ ERROR AL CONECTAR A LA BASE DE DATOS DE MONGODB`.red);
        console.log(err)
    })

    console.log(`╔═════════════════════════════════════════════════════╗`.green)
    console.log(`║ `.green + " ".repeat(-1 + palo - 1) + " ║".green)
    console.log(`║ `.green + `      Conectado como ${client.user.tag}`.green + " ".repeat(-1 + palo - 1 - `      Conectado como ${client.user.tag}`.length) + " ║".green)
    console.log(`║ `.green + " ".repeat(-1 + palo - 1) + " ║".green)
    console.log(`╚═════════════════════════════════════════════════════╝`.green)

    client.user.setActivity("twitch.tv/thesonic__", { type: ActivityType.Streaming, url: 'https://twitch.tv/thesonic__' });
    client.user.setStatus(PresenceUpdateStatus.Online);

    console.log('🔄 Iniciando MoonLink Manager...'.yellow);
    client.manager.init(client.user.id);
    console.log('✅ MoonLink Manager iniciado con éxito.'.green)

    // const commandsArray = Array.from(client.commands.values()).map(cmd => {
    //   if (!cmd.slashBuilder) {
    //     return null
    //   } else return cmd.slashBuilder.toJSON()
    // });
    // const rest = new REST({ version: '10' }).setToken(client.config.token);
    
    // (async () => {
    //   try {
    //     console.log('🔄 Refrescando los comandos (slash)...'.yellow);
    //     await rest.put(
    //       Routes.applicationCommands(client.user.id),
    //       { body: commandsArray},
    //     );

    //     console.log('✅ Comandos recargados con éxito.'.green);
    //   } catch (error) {
    //     console.error('❌ Error al refrescar comandos:'.red, error);
    //   }
    // })()
  }
}