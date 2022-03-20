import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { token, clientId, guildId } from './config'
import commands from './commands'

const rest = new REST({ version: '9' }).setToken(token as string)

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { 
    body: commands.map((c) => c.data.toJSON()), 
  })
  .then(() => console.log('Registered commands', commands))
  .catch(console.error)
