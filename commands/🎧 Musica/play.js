const { SlashCommandBuilder } = require('discord.js')

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

  run: async (
    client,
    message,
    args,
    prefix,
    interaction
  ) => {
    console.log(message)
    if (message) {
      return message.reply("Aqui deberia pasar algo compañero...")
    } else {
      console.log(interaction)
      await interaction.reply("Aqui deberia pasar algo compañero...")
    }
  }
}