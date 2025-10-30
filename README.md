# 🤖 Discord Bot

Um bot Discord desenvolvido para gerenciar tarefas, pagamentos e avaliações de forma eficiente.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [Yarn](https://yarnpkg.com/) (gerenciador de pacotes)

## 🚀 Instalação

Clone o repositório e instale as dependências:

```bash
# Clone o repositório
git clone <seu-repositorio>

# Entre no diretório do projeto
cd <nome-do-projeto>

# Instale as dependências
yarn

# Crie um arquivo .env

# Insira as informações relacionadas ao .env com o .env.example
```

> **⚠️ Importante:** Na primeira vez que usar o projeto, você **deve** instalar as dependências com o comando `yarn`.

## ⚙️ Configuração

Antes de executar o bot, certifique-se de configurar as variáveis de ambiente necessárias (token do bot, etc).

## 🖥️ Comandos do Terminal

### Registrar comandos do bot
```bash
node deploy-commands.js
```
Execute este comando para registrar os comandos slash do bot no Discord.

### Iniciar o bot
```bash
yarn start
```
Inicia o bot e mantém ele online.

## 💬 Comandos do Bot

### `/task`
Cria uma nova tarefa em um canal específico baseado no ID do canal.

**Uso:**
```
/task
```

---

### `/pagar`
Retorna uma mensagem com o status de pagamento.

**Uso:**
```
/pagar
```

---

### `/avaliar`
Avalia uma tarefa criada, mencionando o usuário que a executou.

**Uso:**
```
/avaliar
```

## 📦 Estrutura do Projeto

```
.
├── deploy-commands.js    # Script para registrar comandos
├── package.json          # Dependências do projeto
└── ...                   # Outros arquivos do bot
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## 📝 Licença

Este projeto está sob a licença [MIT](LICENSE).

---

<p align="center">Feito com ❤️ e JavaScript</p>
