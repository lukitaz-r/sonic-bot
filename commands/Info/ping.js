const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  name: 'ping',
  aliases: ['latencia', 'ms'],
  desc: 'Sirve para ver la latencia del Bot',
  slashBuilder: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('❓¡Vea la latencia del Bot!'),
  /**
   * Ejecuta el comando ping.
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
    const latency = Math.round(client.ws.ping);
    if (interaction) await interaction.reply(`Pong! El ping del Bot es de \`${latency}ms\``)
    if (message) await message.reply(`Pong! El ping del Bot es de \`${latency}ms\``)
  }
}