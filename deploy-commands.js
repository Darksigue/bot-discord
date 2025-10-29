const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
require("dotenv").config();

console.log("🔍 Verificando variáveis de ambiente...");
console.log(
  `   BOT_TOKEN: ${process.env.BOT_TOKEN ? "✅ Definido" : "❌ Faltando"}`
);
console.log(`   CLIENT_ID: ${process.env.CLIENT_ID || "❌ Faltando"}`);
console.log(`   GUILD_ID: ${process.env.GUILD_ID || "❌ Faltando"}`);
console.log();

if (!process.env.BOT_TOKEN || !process.env.CLIENT_ID || !process.env.GUILD_ID) {
  console.error("❌ Erro: Variáveis de ambiente faltando no .env");
  process.exit(1);
}

const commands = [];
const commandsPath = path.join(__dirname, "commands", "utility");

console.log(`📂 Procurando comandos em: ${commandsPath}\n`);

// Verifica se a pasta existe
if (!fs.existsSync(commandsPath)) {
  console.error(`❌ Erro: Pasta ${commandsPath} não encontrada!`);
  process.exit(1);
}

const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((f) => f.endsWith(".js"));

console.log(`📁 Arquivos encontrados: ${commandFiles.join(", ")}\n`);

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);

  // Limpa o cache
  delete require.cache[require.resolve(filePath)];

  const command = require(filePath);

  if ("data" in command && "execute" in command) {
    const commandData = command.data.toJSON();
    commands.push(commandData);
    console.log(
      `✅ Carregado: ${commandData.name} - ${commandData.description}`
    );
  } else {
    console.log(`⚠️  Pulado: ${file} (falta "data" ou "execute")`);
  }
}

console.log(`\n📋 Total: ${commands.length} comando(s) para registrar\n`);

if (commands.length === 0) {
  console.error("❌ Nenhum comando encontrado para registrar!");
  process.exit(1);
}

const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log(
      `🚀 Registrando comandos no servidor (GUILD_ID: ${process.env.GUILD_ID})...`
    );

    const data = await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log(`\n✅ SUCESSO! ${data.length} comando(s) registrado(s):\n`);

    data.forEach((cmd, index) => {
      console.log(`   ${index + 1}. /${cmd.name}`);
      console.log(`      Descrição: ${cmd.description}`);
      console.log(`      ID: ${cmd.id}`);
      console.log();
    });

    console.log("🎉 Os comandos agora devem aparecer no Discord!");
    console.log(
      "💡 Se não aparecerem imediatamente, aguarde até 5 minutos ou:"
    );
    console.log("   - Feche e abra o Discord");
    console.log("   - Ou use Ctrl+R para recarregar\n");
  } catch (error) {
    console.error("\n❌ ERRO ao registrar comandos:\n");
    console.error(error);

    if (error.code === 50001) {
      console.error("\n⚠️  Missing Access - O bot não tem acesso:");
      console.error("   1. Verifique se o GUILD_ID está correto");
      console.error("   2. Verifique se o bot está no servidor");
      console.error(
        "   3. Reinstale o bot com o scope 'applications.commands'"
      );
    } else if (error.code === 10004) {
      console.error("\n⚠️  Unknown Guild - GUILD_ID inválido");
    } else if (error.code === 0) {
      console.error("\n⚠️  Problema de autenticação - verifique o BOT_TOKEN");
    }
  }
})();
