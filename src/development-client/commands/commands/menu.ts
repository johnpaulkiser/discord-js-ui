import { SlashCommandBuilder } from '@discordjs/builders'
import { Command } from '../types'
import { createSelectMenu } from '../../../'
import { MessageEmbed } from 'discord.js'

export const menu: Command = {
  data: new SlashCommandBuilder()
    .setName('menu')
    .setDescription('Replies with a menu!'),
  execute: async (interaction) => {
    createSelectMenu(interaction, [
      {
        contents: 'option 1',
        embed: new MessageEmbed({
          title: 'Option 1',
        }),
        label: 'Option 1',
        description: '',
      },
      {
        contents: 'option 2',
        label: 'Option 2',
        description: '',
      },
      {
        label: 'Option 3',
        description: '',
        embed: [
          new MessageEmbed({
            title: 'Option 3',
          }),
          new MessageEmbed({
            title: 'Option 3',
          }),
        ],
      },
      {
        label: 'Option 4',
        contents: 'option 4 contents',
        description: '',
        embed: [
          new MessageEmbed({
            title: 'Option 4',
          }),
          new MessageEmbed({
            title: 'Option 4',
          }),
        ],
      },
    ])
  },
}
