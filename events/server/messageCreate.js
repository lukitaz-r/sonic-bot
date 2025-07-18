
module.exports = {
  name: 'messageCreate',
  /**
  * @param client Instancia del cliente de Discord
  * @param message Mensaje que se lee
  */
  run: async (client, message) => {
    const { prefix, greetings } = client.config; 
    const { apiAI, vipRoles } = client.config.opcionales 
    const botId = client.user.id; // id del bot
    const tag = `<@${botId}>`; // tag del bot

    // Ignorar bots y mensajes que no sean de servidor o canal de texto
    if (message.author.bot || !message.guild || !message.channel) return

    const content = message.content.trim();
    const isCommand = content.startsWith(prefix);
    const isMention = content.includes(tag);
    if (!isCommand && !isMention) return;

    // Extraer argumentos
    let args = [];
    if (isCommand) {
      args = content.slice(prefix.length).trim().split(/ +/);
    } else if (isMention) {
      args = content
        .split(/ +/)
        .filter(token => token !== tag)
    }

    const invoked = args.shift()?.toLowerCase();
    const command = 
      client.commands.get(invoked) 
      || client.commands.find(cmd => cmd.aliases?.includes(invoked));

    // Si el comando existe
    if (command) {
      // Helpers para comprobación de permisos
      const { permissionsBot, permisos: userPerms } = command;
      const botMember = message.guild.members.me;

      if (permissionsBot && !botMember.permissions.has(permissionsBot)) {
        const missing = permissionsBot.map(p => `\`${p}\``).join(', ');
        return message.reply(
          `❌ **No tengo suficientes permisos para ejecutar este comando!**\n` +
            `Necesito: ${missing}`
        );
      }

      if (userPerms && !message.member.permissions.has(userPerms)) {
        const missing = userPerms.map(p => `\`${p}\``).join(', ');
        return message.reply(
          `❌ **No tienes suficientes permisos para ejecutar este comando!**\n` +
            `Necesitas: ${missing}`
        );
      }

      // Ejecutar comando
      return command.run(client, message, args);
    }

    // Si no es comando
    if (isCommand) {
      return message.reply('💔 **¡No he encontrado ese comando!**');
    }

    // Menciones al bot sin comando válido
    if (message.author.id === '1052388988368990279' && apiAI) {
      // Usuario premium con IA activada
      return client.commands.get('ia')?.run(client, message, args);
    }

    // Respuesta de saludo aleatorio
    const saludo = greetings[Math.floor(Math.random() * greetings.length)];
    return message.reply(saludo);
  }
}