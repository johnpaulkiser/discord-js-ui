import { Collection } from 'discord.js'
import * as commands from './commands'
import { Command } from './types'

export function getCommands(): Collection<string, Command> {
  const results = new Collection<string, Command>()
  for (const key of Object.keys(commands) as Array<keyof typeof commands>) {
    results.set(commands[key].data.name, commands[key] as Command)
  }
  return results
}

const readyCommands = getCommands()
export default readyCommands
