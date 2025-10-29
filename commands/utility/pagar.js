const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("pagar")
    .setDescription("Marca uma pessoa com status")
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription("Usuário que completou a task")
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
    const status = interaction.options.getString("status");

    console.log(`💰 Marcando status como ${status} para ${usuario.tag}`);

    await interaction.deferReply({ ephemeral: true });

    await interaction.channel.send(
      `-# ### Usuário: <@${usuario.id}> **status: ${status}** <:money:1432490151170281603>`
    );

    await interaction.editReply({
      content: `Status marcado como ${status} para ${usuario.username}`,
    });

    console.log(`✅ Pagamento registrado!`);
  },
};
