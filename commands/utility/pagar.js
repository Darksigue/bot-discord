const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pagar")
    .setDescription("Marca uma task como PAGA")
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription("Usuário que completou a task")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("task_id")
        .setDescription("ID da task (ex: 001)")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("status")
        .setDescription("Status da task (ex: PAGA)")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const usuario = interaction.options.getUser("usuario");
    const taskId = interaction.options.getString("task_id");
    const status = interaction.options.getString("status");

    console.log(
      `      💰 Marcando task ${taskId} como ${status} para ${usuario.tag}`
    );

    await interaction.channel.send(
      `
-# ### Usuário: <@${usuario.id}>
-# ### <:money:1432490151170281603> **task: ${taskId} status: ${status}** <:money:1432490151170281603>`
    );

    await interaction.reply({
      content: `✅ Task ${taskId} marcada como ${status} para ${usuario.username}`,
      ephemeral: true,
    });

    console.log(`      ✅ Pagamento registrado!`);
  },
};
