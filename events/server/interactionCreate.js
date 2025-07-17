module.exports = {
  name: 'interactionCreate',
  run: async (client, interaction) => {
    if (!interaction.isCommand()) return;
    
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    
    try {
      command.run(client, false, false, false, interaction);
    } catch (error) {
      console.error(error);
      interaction.reply({
        content: '❌ **¡Hubo un error al ejecutar este comando!** ❌',
        ephemeral: true,
      });
    }
  }
}