const {
  Client,
  Collection,
  GatewayIntentBits,
  Events,
  MessageFlags,
  Partials,
  EmbedBuilder,
} = require("discord.js");
require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");

const TARGET_CHANNEL_ID =
  process.env.TARGET_CHANNEL_ID || "YOUR_CHANNEL_ID_HERE";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.Reaction],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands/utility");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((f) => f.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
    console.log(`✅ Comando carregado: ${command.data.name}`);
  } else {
    console.log(`[⚠️] O comando ${file} está faltando "data" ou "execute".`);
  }
}

console.log(`📦 Total: ${client.commands.size} comando(s) carregados\n`);

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  console.log(`💬 Mensagem de ${message.author.tag}: "${message.content}"`);

  if (message.content.toLowerCase() === "panga") {
    console.log(`   ✅ Respondendo com Pong!`);
    await message.reply("🏓 Pong!");
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    console.log(`\n🎯 Comando: /${interaction.commandName}`);

    const command = client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`   [❌] Comando não encontrado`);
      await interaction.reply({
        content: "❌ Comando não encontrado!",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    try {
      await command.execute(interaction);
      console.log(`   ✅ Comando executado!\n`);
    } catch (error) {
      console.error(`   [💥] Erro:`, error);
      const reply = {
        content: "❌ Erro ao executar o comando!",
        flags: MessageFlags.Ephemeral,
      };
      try {
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(reply);
        } else {
          await interaction.reply(reply);
        }
      } catch (replyError) {
        console.error("   [💥] Erro ao enviar resposta:", replyError);
      }
    }
  }

  if (interaction.isModalSubmit()) {
    console.log(`\n📝 Modal submit recebido: ${interaction.customId}`);

    if (interaction.customId === "info_modal") {
      const taskId = interaction.fields.getTextInputValue("task_id_input");
      const tema = interaction.fields.getTextInputValue("topic_input");
      const recompensa = interaction.fields.getTextInputValue("reward_input");
      const prazo = interaction.fields.getTextInputValue("prazo_input");
      const info = interaction.fields.getTextInputValue("info_input");

      console.log(`   Task ID: ${taskId}`);
      console.log(`   Tema: ${tema}`);
      console.log(`   Recompensa: ${recompensa}`);
      console.log(`   Prazo: ${prazo}`);

      function getRandomEmoji() {
        const emojis = [
          "<:mouse:1432520345684021268>",
          "<:trophy:1432490210184269864>",
          "<:custom_rocket:1432490182409453739>",
          "<:flag:1432490175199711283>",
          "<:compass:1432490140139524098>",
          "<:battery:1432490128911106119>",
          "<:key:1432490078076272776>",
        ];
        return emojis[Math.floor(Math.random() * emojis.length)];
      }

      const taskDescription = `
# ** Task ${taskId} ${getRandomEmoji()} **

-# - <:chat:1432513971730124830> **${tema}**
-# - <:money:1432490151170281603> **R$${recompensa}**
-# - <:hourglass:1432490224000172184> **${prazo}**
-#  **${info}**

-# **Não assuma Tasks que você não consiga entregar ou para as quais não tenha as competências necessárias.**
`;

      const embed = new EmbedBuilder()
        .setTitle("✅ Atividade Criada")
        .setColor(0x00ff00)
        .setDescription(taskDescription)
        .setTimestamp()
        .setFooter({ text: `Criado por ${interaction.user.username}` });

      try {
        const targetChannel = await client.channels.fetch(TARGET_CHANNEL_ID);

        if (targetChannel && targetChannel.isTextBased()) {
          const sentMessage = await targetChannel.send({ embeds: [embed] });
          console.log(`   ✅ Task enviada para o canal ${TARGET_CHANNEL_ID}`);
          console.log(`   📨 Message ID: ${sentMessage.id}`);

          try {
            await sentMessage.react("✅");
            console.log(`   ✅ Emoji ✅ adicionado à task automaticamente`);
          } catch (reactionError) {
            console.error(`   ⚠️  Erro ao adicionar emoji:`, reactionError);
          }

          if (!client.taskMessages) client.taskMessages = new Set();
          client.taskMessages.add(sentMessage.id);
          console.log(`   🔒 Task rastreada para primeira reação\n`);

          await interaction.reply({
            content: `✅ Atividade criada com sucesso! Confira em <#${TARGET_CHANNEL_ID}>`,
            ephemeral: true,
          });
        } else {
          console.error("   ❌ Canal não encontrado");
          await interaction.reply({
            content: "❌ Erro: Canal de destino não encontrado",
            ephemeral: true,
          });
        }
      } catch (error) {
        console.error("   [💥] Erro ao enviar para o canal:", error);

        await interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
      }
    }
  }
});

client.once(Events.ClientReady, (c) => {
  console.log(`✅ Bot logado como ${c.user.tag}`);
  console.log(`📋 ${client.commands.size} comando(s) disponíveis`);
  console.log(`🌐 Conectado em ${c.guilds.cache.size} servidor(es)`);
  console.log(`💬 Aguardando comandos e mensagens...\n`);

  client.taskMessages = new Set();
});

client.on(Events.MessageReactionAdd, async (reaction, user) => {
  if (user.bot) return;

  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error("Erro ao buscar reação:", error);
      return;
    }
  }

  if (!client.taskMessages || !client.taskMessages.has(reaction.message.id)) {
    return;
  }

  console.log(`\n👍 Reação detectada na task!`);
  console.log(`   Usuário: ${user.tag}`);
  console.log(`   Emoji: ${reaction.emoji.name}`);
  console.log(`   Total de reações neste emoji: ${reaction.count}`);

  const isCorrectEmoji =
    reaction.emoji.name === "✅" || reaction.emoji.name === "white_check_mark";

  if (!isCorrectEmoji) {
    console.log(`   ⏭️  Emoji inválido, esperando ✅\n`);
    return;
  }

  if (reaction.count === 2) {
    console.log(
      `   🎯 PRIMEIRA REAÇÃO DE USUÁRIO COM ✅! ${user.tag} pegou a task\n`
    );

    const embed = reaction.message.embeds[0];

    console.log("   Embed encontrada: ", embed);

    const description = embed.description;
    const taskNameMatch = description.match(/Task\s([^\s<]*)\s/);

    let taskName = "Desconhecida";
    if (taskNameMatch && taskNameMatch[1]) {
      taskName = taskNameMatch[1];
    }

    console.log("   Task Nome:", taskName);

    try {
      await reaction.message.reply({
        content: `<:flag:1432490175199711283> <@${user.id}> assumiu a responsabilidade pela Task **${taskName}**! 🎉`,
        allowedMentions: { users: [user.id] },
      });

      client.taskMessages.delete(reaction.message.id);

      console.log(
        `   ✅ Task ${taskName} marcada como assumida por ${user.tag}`
      );
    } catch (error) {
      console.error("   ❌ Erro ao enviar a resposta:", error);
    }
  } else {
    console.log(`   ⏭️  Já existe reação de usuário com ✅, ignorando\n`);
  }
});

client.login(process.env.BOT_TOKEN);
