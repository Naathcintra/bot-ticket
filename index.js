console.log('INICIOU O BOT');

\const {
  Client,
  GatewayIntentBits,
  PermissionsBitField,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// ===== CONFIG =====
const CATEGORIA_TICKETS = '1485637897049866320';
const CANAL_LOGS = 'COLOQUE_O_ID_DO_CANAL_LOGS'; // pode deixar '' se não quiser
const PREFIXO = '!';
// ==================

client.once('clientReady', () => {
  console.log(`Logado como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  if (message.content === `${PREFIXO}painel`) {
    const embed = new EmbedBuilder()
      .setColor('#ff69b4')
      .setTitle('🎀 Central de Tickets')
      .setDescription(
        'Escolha uma opção abaixo para abrir seu atendimento:\n\n' +
        '🛒 Compras\n' +
        '💳 Pagamento\n' +
        '🆘 Suporte\n' +
        '🤝 Parceria'
      );

    const menu = new StringSelectMenuBuilder()
      .setCustomId('ticket_menu')
      .setPlaceholder('Selecione uma opção')
      .addOptions([
        { label: 'Compras', value: 'compras', emoji: '🛒' },
        { label: 'Pagamento', value: 'pagamento', emoji: '💳' },
        { label: 'Suporte', value: 'suporte', emoji: '🆘' },
        { label: 'Parceria', value: 'parceria', emoji: '🤝' }
      ]);

    const row = new ActionRowBuilder().addComponents(menu);

    await message.channel.send({
      embeds: [embed],
      components: [row]
    });
  }
});

client.on('interactionCreate', async (interaction) => {
  // ===== MENU =====
  if (interaction.isStringSelectMenu() && interaction.customId === 'ticket_menu') {
    const tipo = interaction.values[0];

    const nomes = {
      compras: '🛒 Compras',
      pagamento: '💳 Pagamento',
      suporte: '🆘 Suporte',
      parceria: '🤝 Parceria'
    };

    const descricoes = {
      compras: 'Explique aqui o que deseja comprar.',
      pagamento: 'Explique aqui seu problema com pagamento.',
      suporte: 'Explique aqui seu problema.',
      parceria: 'Explique sua proposta de parceria.'
    };

    const nomeCanal = `${tipo}-${interaction.user.username}`
      .toLowerCase()
      .replace(/[^a-z0-9\-]/g, '');

    const canal = await interaction.guild.channels.create({
      name: nomeCanal,
      type: ChannelType.GuildText,
      parent: CATEGORIA_TICKETS || null,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory
          ]
        }
      ]
    });

    const embed = new EmbedBuilder()
      .setColor('#ff69b4')
      .setTitle(nomes[tipo])
      .setDescription(`${interaction.user}, ${descricoes[tipo]}`);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('fechar')
        .setLabel('Fechar Ticket')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('🔒')
    );

    await canal.send({
      content: `${interaction.user}`,
      embeds: [embed],
      components: [row]
    });

    await interaction.reply({
      content: `ticket criado: ${canal}`,
      ephemeral: true
    });
  }

  // ===== FECHAR =====
  if (interaction.isButton() && interaction.customId === 'fechar') {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('deletar')
        .setLabel('Deletar Ticket')
        .setStyle(ButtonStyle.Danger)
    );

    const embed = new EmbedBuilder()
      .setColor('#ff69b4')
      .setTitle('Ticket fechado')
      .setDescription('clique abaixo para deletar');

    await interaction.update({
      embeds: [embed],
      components: [row]
    });
  }

  // ===== DELETAR =====
  if (interaction.isButton() && interaction.customId === 'deletar') {
    await interaction.reply({
      content: 'apagando...',
      ephemeral: true
    });

    setTimeout(() => {
      interaction.channel.delete().catch(console.error);
    }, 1500);
  }
});

client.once('ready', () => {
  console.log(`Logado como ${client.user.tag}`);
});

console.log('1 - antes do login');

client.login(process.env.TOKEN)
  .then(() => console.log('2 - login aceito'))
  .catch(err => console.error('3 - erro no login:', err));

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Bot online');
});

app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log('Porta aberta');
});