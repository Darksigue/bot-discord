const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avaliar")
    .setDescription("Avalia o trabalho de um usuário")
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription("Usuário a ser avaliado")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("estrelas")
        .setDescription("Quantidade de estrelas (1-5)")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(5)
    )
    .addStringOption((option) =>
      option
        .setName("task")
        .setDescription("Nome da Task que está sendo avaliada")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const usuario = interaction.options.getUser("usuario");
    const estrelas = interaction.options.getInteger("estrelas");
    const taskName = interaction.options.getString("task");

    if (estrelas < 1 || estrelas > 5) {
      await interaction.reply({
        content: "❌ Erro: A quantidade de estrelas deve ser entre 1 e 5!",
        ephemeral: true,
      });
      console.log(
        `      ❌ Tentativa de avaliar com ${estrelas} estrelas (inválido)`
      );
      return;
    }

    console.log(`      ⭐ Avaliando ${usuario.tag} com ${estrelas} estrelas`);

    const starsEmoji = "<:star:1432490164755763371> ".repeat(estrelas);

    const mensagem = `
**Task**: ${taskName}  
**Revisão para**: <@${usuario.id}>  
**Avaliação**: ${starsEmoji}  
`;

    await interaction.channel.send(mensagem);

    await interaction.reply({
      content: `✅ Avaliação de ${estrelas}⭐ enviada para ${usuario.username} na task **${taskName}**.`,
      ephemeral: true,
    });

    console.log(`      ✅ Avaliação enviada!`);
  },
};
