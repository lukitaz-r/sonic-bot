const fs = require('fs')
const path = require('path')

// Lista para almacenar nombres de eventos cargados
const allEvents = []

module.exports = async(client) => {
  console.log('🔄 Cargando los eventos...'.yellow)
  let count = 0

  const loadDir = (folder) => {
    const dirPath = path.join(__dirname, '..', 'events', folder)
    const files = fs.readdirSync(dirPath).filter((f) => f.endsWith('.js') || f.endsWith('.ts'))

    for (const file of files) {
      try {
        const eventModule = require(path.join(dirPath, file))

        allEvents.push(eventModule.name)
        if (eventModule.once) {
          client.once(eventModule.name, (...args) => {
            eventModule.run(client, ...args)
          }) 
        } else {
          client.on(eventModule.name, (...args) => {
            eventModule.run(client, ...args)
          })
        }
        
        count++
      } catch (error) {
        console.error(`Error cargando evento ${file}:`.red, error)
      }
    }
  }

  ['client', 'server'].forEach(loadDir)

  console.log(`✅ ${count} eventos cargados:`.green, allEvents.join(', ').blue)
  console.log('🔄 Iniciando Sesión el Bot...'.yellow)
}