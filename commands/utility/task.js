const {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("task")
    .setDescription("Cria uma nova task com modal"),

  async execute(interaction) {
    console.log("      ⚡ Executando comando /task");
    console.log(`      👤 Usuário: ${interaction.user.tag}`);

    const modal = new ModalBuilder()
      .setCustomId("info_modal")
      .setTitle("Modal de Atividade");

    const taskIdInput = new TextInputBuilder()
      .setCustomId("task_id_input")
      .setLabel("Task ID")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Enter Task ID")
      .setMinLength(1)
      .setMaxLength(100)
      .setRequired(true);

    const topicInput = new TextInputBuilder()
      .setCustomId("topic_input")
      .setLabel("Tema")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Enter Topic")
      .setMinLength(1)
      .setMaxLength(200)
      .setRequired(true);

    const rewardInput = new TextInputBuilder()
      .setCustomId("reward_input")
      .setLabel("Recompensa")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Insert the reward...")
      .setMaxLength(100)
      .setRequired(true);

    const prazoInput = new TextInputBuilder()
      .setCustomId("prazo_input")
      .setLabel("Prazo")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Ex: 2025-12-31 ou 7 dias")
      .setMaxLength(100)
      .setRequired(true);

    const infoInput = new TextInputBuilder()
      .setCustomId("info_input")
      .setLabel("Info")
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder("Informações adicionais...")
      .setMaxLength(1000)
      .setRequired(true);

    const rows = [
      new ActionRowBuilder().addComponents(taskIdInput),
      new ActionRowBuilder().addComponents(topicInput),
      new ActionRowBuilder().addComponents(rewardInput),
      new ActionRowBuilder().addComponents(prazoInput),
      new ActionRowBuilder().addComponents(infoInput),
    ];

    modal.addComponents(...rows);

    await interaction.showModal(modal);
    console.log("      ✅ Modal enviado!");
  },
};
