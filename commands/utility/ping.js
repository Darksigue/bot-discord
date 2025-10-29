const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("panga")
    .setDescription("Responde com Pong!"),

  async execute(interaction) {
    console.log("      ⚡ Dentro do execute do comando panga");
    await interaction.reply("🏓 Pong!");
    console.log("      ✅ Reply enviado!");
  },
};
