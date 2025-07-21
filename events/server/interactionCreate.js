module.exports = {
  name: 'interactionCreate',
  run: async (client, interaction) => {
    const { prefix } = client.config
    if (!interaction.isCommand()) return
    
    const command = client.commands.get(interaction.commandName)
    if (!command) return

    try {
      // como adopta los demas parametros del comando, se tiene que poner como 'falso' a todos los demas valores que no usamos.
      // const { permissionsBot, permisos: userPerms } = command;
      // const botMember = interaction.guild.members.me;

      // if (permissionsBot && !botMember.permissions.has(permissionsBot)) {
      //   const missing = permissionsBot.map(p => `\`${p}\``).join(', ');
      //   return interaction.reply(
      //     `❌ **No tengo suficientes permisos para ejecutar este comando!**\n` +
      //       `Necesito: ${missing}`
      //   );
      // }

      // if (userPerms && !interaction.member.permissions.has(userPerms)) {
      //   const missing = userPerms.map(p => `\`${p}\``).join(', ');
      //   return interaction.reply(
      //     `❌ **No tienes suficientes permisos para ejecutar este comando!**\n` +
      //       `Necesitas: ${missing}`
      //   );
      // }
      command.run(client, false, false, prefix, interaction)
    } catch (error) {
      console.error(error)
      interaction.reply({
        content: '❌ **¡Hubo un error al ejecutar este comando!** ❌',
        ephemeral: true,
      })
    }
  }
}