const { readdirSync } = require('fs')
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, SlashCommandBuilder } = require('discord.js')


const FOOTER = {
  text: '© desarrollado por lukitaz_r | 2025',
}

function listCategories(path = './commands') {
  return readdirSync(path).filter(dir => dir)
}

function getCommand(nameOrAlias, client) {
  const key = nameOrAlias.toLowerCase()
  return client.commands.get(key)
    || client.commands.find(cmd => cmd.aliases?.includes(key))
}

function getCategory(name, categories) {
  return categories.find(cat => cat.toLowerCase().endsWith(name.toLowerCase()))
}

function buildCommandEmbed(cmd, client) {
  const embed = new EmbedBuilder()
    .setTitle(`Comando \`${cmd.name}\``)
    .setColor(client.color)
    .setFooter(FOOTER)

  if (cmd.desc) embed.addFields({ name: '✍ Descripción', value: `\`\`\`${cmd.desc}\`\`\`` })
  if (cmd.aliases?.length) embed.addFields({ name: '✅ Alias', value: cmd.aliases.map(a => `\`${a}\``).join(', ') })
  if (cmd.permisos?.length) embed.addFields({ name: '👤 Permisos requeridos', value: cmd.permisos.map(p => `\`${p}\``).join(', ') })
  if (cmd.permisos_bot?.length) embed.addFields({ name: '🤖 Permisos de BOT requeridos', value: cmd.permisos_bot.map(p => `\`${p}\``).join(', ') })

  return embed
}

function buildCategoryEmbed(category, client, index, total, guild) {
  const commands = readdirSync(`./commands/${category}`)
    .filter(file => file.endsWith('.js'))
    .map(file => `\`${file.replace(/\.js$/, '')}\``)

  return new EmbedBuilder()
    .setTitle(`Categoría: ${category}`)
    .setColor(client.color)
    .setThumbnail(guild.iconURL({ dynamic: true }))
    .setDescription(commands.length ? `>>> *${commands.join(' - ')}*` : '>>> *Sin comandos aún...*')
    .setFooter({ text: `Página ${index} / ${total}`, iconURL: FOOTER.iconURL });
}

const emojiMap = {
  ADMIN:       '🔧',
  Moderacion:  '🔨',
  Musica:      '🎧',
  Info:        '❓',
  // … el resto de tus carpetas
};

module.exports = {
  name: 'help',
  aliases: ['h', 'ayuda', 'bothelp'],
  desc: 'Muestra información del bot y sus comandos',
  slashBuilder: new SlashCommandBuilder()
    .setName("help")
    .setDescription("❓ ¡Consulta la información del bot!")
    .addStringOption(opt =>
      opt.setName("comando")
        .setDescription("❓ El nombre del comando que quieres ver.")
        .setRequired(false)
    ),
  async run(client, message, args, prefix, interaction) {
    const latency = Math.round(client.ws.ping)
    const categories = listCategories()
    let input

    if (message) {
      input = args.join(' ')
      if (input.length) {
        const cmd = getCommand(input, client)
        const cat = getCategory(input, categories)

        if (cmd) {
          return message.reply({ embeds: [buildCommandEmbed(cmd, client)] })
        }

        if (cat) {
          const embed = buildCategoryEmbed(cat, client, 1, 1, message.guild)
            .setTitle(`Categoría: ${cat}`)
          return message.reply({ embeds: [embed] })
        }

        return message.reply(`❌ Comando o categoría \`${input}\` no encontrada. Usa \`${prefix}help\` para ver más.`)
      }

      const totalPages = categories.length + 1
      let currentPage = 0

      const overview = new EmbedBuilder()
      .setTitle(`Ayuda de __${client.user.tag}__`)
      .setColor(client.color)
      .setDescription(`Bot multifuncional en desarrollo por \`lukitaz_r\``)
      .addFields(
        { name: '❓ ¿Quién soy?', value: `👋 Hola **${message.author.username}**, soy **${client.user.username}** con funciones de ADMIN, MODERACIÓN, MÚSICA y más.` },
        { name: '📈 Estadísticas', value: `⚙ **${client.commands.size} comandos** en **${client.guilds.cache.size} servidores**\n📶 \`${latency}ms\` ping` }
      )
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setFooter({ text: `Página 1 / ${totalPages}` });

      const pages = [overview, ...categories.map((cat, i) => buildCategoryEmbed(cat, client, i + 2, totalPages, message.guild))];

      const select = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('help_select')
          .setPlaceholder('Selecciona categoría')
          .addOptions(
            categories.map(cat => ({
              label: cat,
              value: cat,
              description: `Ver comandos de ${cat}`,
              emoji: { name: emojiMap[cat] || '❔' }
            }))
          )
      )

      const nav = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('prev').setLabel('Atrás').setEmoji('⬅️').setStyle('Primary'),
        new ButtonBuilder().setCustomId('home').setLabel('Inicio').setEmoji('🏠').setStyle('Secondary'),
        new ButtonBuilder().setCustomId('next').setLabel('Avanzar').setEmoji('➡️').setStyle('Primary')
      );

      const helpMsg = await message.reply({ embeds: [pages[0]], components: [select, nav] });

      const collector = helpMsg.createMessageComponentCollector({
        filter: i => i.user.id === message.author.id,
        idle: 180000
      });

      collector.on('collect', async inter => {
        if (inter.isSelectMenu()) {
          const selected = inter.values[0]
          const embed = buildCategoryEmbed(selected, client, 1, 1, message.guild)
          return inter.reply({ embeds: [embed], ephemeral: true })
        }

        switch (inter.customId) {
          case 'prev':
            currentPage = (currentPage - 1 + pages.length) % pages.length;
            break
          case 'next':
            currentPage = (currentPage + 1) % pages.length;
            break
          case 'home':
            currentPage = 0;
            break
        }

        await inter.update({ embeds: [pages[currentPage]] });
        collector.resetTimer();
      })

      collector.on('end', () => {
        helpMsg.edit({ content: `Tiempo expirado. Vuelve a usar \`${prefix}help\` para reabrirlo.`, components: [] }).catch(() => {});  
      })
    }

    if (interaction) {
      let input = interaction.options.getString("comando", false)
      await interaction.deferReply()
      if (input) {
        const cmd = getCommand(input, client)
        const cat = getCategory(input, categories)

        if (cmd) {
          await interaction.editReply({ embeds: [buildCommandEmbed(cmd, client)] })
          return
        }
        if (cat) {
          const embed = buildCategoryEmbed(cat, client, 1, 1, message.guild)
            .setTitle(`Categoría: ${cat}`)
          await interaction.editReply({ embeds: [embed] })
          return
        }

        await interaction.editReply(`❌ Comando o categoría \`${input}\` no encontrada. Usa \`${prefix}help\` para ver más.`)
        return
      }

      const totalPages = categories.length + 1
      let currentPage = 0

      const overview = new EmbedBuilder()
      .setTitle(`Ayuda de __${client.user.tag}__`)
      .setColor(client.color)
      .setDescription(`Bot multifuncional en desarrollo por \`lukitaz_r\``)
      .addFields(
        { name: '❓ ¿Quién soy?', value: `👋 Hola **${interaction.user.username}**, soy **${client.user.username}** con funciones de ADMIN, MODERACIÓN, MÚSICA y más.` },
        { name: '📈 Estadísticas', value: `⚙ **${client.commands.size} comandos** en **${client.guilds.cache.size} servidores**\n📶 \`${latency}ms\` ping` }
      )
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setFooter({ text: `Página 1 / ${totalPages}` });

      const pages = [overview, ...categories.map((cat, i) => buildCategoryEmbed(cat, client, i + 2, totalPages, interaction.guild))];

      const select = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('help_select')
          .setPlaceholder('Selecciona categoría')
          .addOptions(
            categories.map(cat => ({
              label: cat,
              value: cat,
              description: `Ver comandos de ${cat}`,
              emoji: { name: emojiMap[cat] || '❔' }
            }))
          )
      )

      const nav = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('prev').setLabel('Atrás').setEmoji('⬅️').setStyle('Primary'),
        new ButtonBuilder().setCustomId('home').setLabel('Inicio').setEmoji('🏠').setStyle('Secondary'),
        new ButtonBuilder().setCustomId('next').setLabel('Avanzar').setEmoji('➡️').setStyle('Primary')
      );

      const helpMsg = await interaction.editReply({ embeds: [pages[0]], components: [select, nav] });

      const collector = helpMsg.createMessageComponentCollector({
        filter: i => i.user.id === interaction.user.id,
        idle: 180000
      });

      collector.on('collect', async inter => {
        if (inter.isSelectMenu()) {
          const selected = inter.values[0]
          const embed = buildCategoryEmbed(selected, client, 1, 1, interaction.guild)
          return inter.reply({ embeds: [embed], ephemeral: true })
        }

        switch (inter.customId) {
          case 'prev':
            currentPage = (currentPage - 1 + pages.length) % pages.length;
            break
          case 'next':
            currentPage = (currentPage + 1) % pages.length;
            break
          case 'home':
            currentPage = 0;
            break
        }

        await inter.update({ embeds: [pages[currentPage]] });
        collector.resetTimer();
      })

      collector.on('end', () => {
        helpMsg.edit({ content: `Tiempo expirado. Vuelve a usar \`${prefix}help\` para reabrirlo.`, components: [] }).catch(() => {});  
      })
    }
  }
}
