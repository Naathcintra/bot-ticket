console.log('INICIOU O BOT');

const {
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
const CANAL_LOGS = ''; 
const PREFIXO = '!';
// ==================

client.once('ready', () => {
  console.log(`Logado como ${client.user.tag}`);
});

client.on('error', console.error);
client.on('warn', console.warn);

// ===== COMANDO =====
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  if (message.content === `${PREFIXO}painel`) {
    const embed = new EmbedBuilder()
      .setColor('#ff69b4')
      .setTitle('🎀 Central de Tickets')
      .setDescription(
        'Escolha uma opção abaixo para abrir seu atendimento:\n\n' +
        '🛒 Compras\n💳 Pagamento\n🆘 Suporte\n🤝 Parceria'
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

// ===== INTERAÇÕES =====
client.on('interactionCreate', async (interaction) => {

  if (interaction.isStringSelectMenu() && interaction.customId === 'ticket_menu') {
    const tipo = interaction.values[0];

    const nomes = {
      compras: '🛒 Compras',
      pagamento: '💳 Pagamento',
      suporte: '🆘 Suporte',
      parceria: '🤝 Parceria'
    };

    const nomeCanal = `${tipo}-${interaction.user.username}`
      .toLowerCase()
      .replace(/[^a-z0-9\-]/g, '');

    const canal = await interaction.guild.channels.create({
      name: nomeCanal,
      type: ChannelType.GuildText,
      parent: CATEGORIA_TICKETS,
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
      .setDescription(`${interaction.user}, explique seu problema.`);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('fechar')
        .setLabel('Fechar Ticket')
        .setStyle(ButtonStyle.Danger)
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

  if (interaction.isButton() && interaction.customId === 'fechar') {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('deletar')
        .setLabel('Deletar Ticket')
        .setStyle(ButtonStyle.Danger)
    );

    await interaction.update({
      content: 'ticket fechado',
      components: [row]
    });
  }

  if (interaction.isButton() && interaction.customId === 'deletar') {
    await interaction.reply({ content: 'apagando...', ephemeral: true });

    setTimeout(() => {
      interaction.channel.delete().catch(console.error);
    }, 1500);
  }
});

// ===== LOGIN =====
(async () => {
  try {
    console.log('tentando login...');
    await client.login(process.env.TOKEN);
    console.log('LOGIN OK');
  } catch (err) {
    console.error('ERRO NO LOGIN:', err);
  }
})();

// ===== EXPRESS (pra render não desligar) =====
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Bot online');
});

app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log('Porta aberta');
});

// manter vivo
setInterval(() => {}, 1000);