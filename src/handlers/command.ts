import fs from 'fs';
import path from 'path';
import { Client } from 'discord.js';

// Asegúrate de que tu Client extienda con estas propiedades:
// interface BotClient extends Client {
//   commands: Collection<string, any>;
//   aliases: Collection<string, string>;
// }

export default function loadCommands(client: Client & { commands: Map<string, any>; aliases: Map<string, string> }): void {
  try {
    console.log(`\n╔${'═'.repeat(53)}╗`.yellow);
    console.log(`║${' '.repeat(53)}║`.yellow);
    console.log(`║${' '.repeat(
      Math.floor((53 - 'Bienvenido al Handler por lukitaz_r'.length) / 2)
    )}Bienvenido al Handler por lukitaz_r${' '.repeat(
      Math.ceil((53 - 'Bienvenido al Handler por lukitaz_r'.length) / 2)
    )}║`.yellow);
    console.log(`║${' '.repeat(53)}║`.yellow);
    console.log(`╚${'═'.repeat(53)}╝`.yellow);

    let count = 0;
    const commandsDir = path.join(__dirname, '..', 'commands');

    for (const category of fs.readdirSync(commandsDir)) {
      const categoryPath = path.join(commandsDir, category);
      if (!fs.statSync(categoryPath).isDirectory()) continue;

      const commandFiles = fs.readdirSync(categoryPath).filter((f) => f.endsWith('.js') || f.endsWith('.ts'));

      for (const file of commandFiles) {
        try {
          const commandModule = require(path.join(categoryPath, file));
          const command = commandModule.default ?? commandModule;

          if (!command.name) {
            console.log(
              `COMANDO [/${category}/${file}] error => el comando no está configurado`.red
            );
            continue;
          }

          client.commands.set(command.name, command)
          count++;
          
          if (Array.isArray(command.aliases)) {
            for (const alias of command.aliases) {
              client.aliases.set(alias, command.name);
            }
          }
        } catch (error) {
          console.error(`❌ Error cargando comando ${file}:`.red, error);
        }
      }
    }
    console.log(`✅ ${count} Comandos Cargados`.green);
  } catch (error) {
    console.error(error);
  }
}
