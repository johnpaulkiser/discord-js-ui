import { SlashCommandBuilder } from '@discordjs/builders'
import { Command } from '../types'

export const ping: Command = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  execute: async (interaction) => {
    await interaction.reply('Pong!')
  },
}
