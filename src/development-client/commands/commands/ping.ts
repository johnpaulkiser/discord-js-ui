import { SlashCommandBuilder } from '@discordjs/builders'
import { createTabMenu } from '../../../components/tabs'
import { Command } from '../types'

export const ping: Command = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  execute: async (interaction) => {
    createTabMenu(
      interaction,
      [
        {
          contents: 'ping',
          label: 'Ping',
        },
        {
          contents: 'pong',
          label: 'Pong',
        },
        {
          contents: 'ping',
          label: 'Ping',
          style: 'DANGER',
        },
        {
          contents: 'pong',
          label: 'Pong',
          emoji: '✅',
        },
        {
          contents: 'ping',
          label: 'Ping',
        },
      ],
      { startingIndex: 0 },
    )
  },
}
