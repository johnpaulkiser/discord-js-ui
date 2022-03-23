import { token } from './config'
import { Client, Intents } from 'discord.js'
import commands from './commands'
import { UIManager } from '../'

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

client.once('ready', () => {
  console.log('bot started running')
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return

  const command = commands.get(interaction.commandName)
  if (!command) return

  try {
    command.execute(interaction)
  } catch (e) {
    console.error(e)
    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    })
  }
})

//Need to initialze the the UI library first
UIManager.init(client)

client.login(token)
