import fs from 'fs';
import path from 'path';
import { Client } from 'discord.js';

// Lista para almacenar nombres de eventos cargados
const allEvents: string[] = [];

export default async function loadEvents(client: Client): Promise<void> {
  console.log('🔄 Cargando los eventos...'.yellow);
  let count = 0;

  const loadDir = (folder: string) => {
    const dirPath = path.join(__dirname, '..', 'events', folder);
    const files = fs.readdirSync(dirPath).filter((f) => f.endsWith('.js') || f.endsWith('.ts'));
    for (const file of files) {
      try {
        const event = require(`../events/${folder}/${file}`);
        if (event.default.once) {
          // Para los eventos que solo se ejecutan una vez
          client.once(event.default.name, (...args) => event.default.run(client, ...args));
        } else {
          // Para los eventos que se ejecutan multiples veces
          client.on(event.default.name, (...args) => event.default.run(client, ...args));
        }
        count++
      } catch (error) {
        console.error(`Error cargando evento ${file}:`.red, error);
      }
    };
  }

  ['client', 'server'].forEach(loadDir);

  console.log(`✅ ${count} eventos cargados:`.green, allEvents.join(', ').blue);
  console.log('🔄 Iniciando Sesión el Bot...'.yellow);
}