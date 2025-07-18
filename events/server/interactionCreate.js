module.exports = {
  name: 'interactionCreate',
  run: async (client, interaction) => {
    if (!interaction.isCommand()) return;
    
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    
    try {
      // como adopta los demas parametros del comando, se tiene que poner como 'falso' a todos los demas valores que no usamos.
      command.run(client, false, false, client.config.prefix, interaction);
    } catch (error) {
      console.error(error);
      interaction.reply({
        content: '❌ **¡Hubo un error al ejecutar este comando!** ❌',
        ephemeral: true,
      });
    }
  }
}