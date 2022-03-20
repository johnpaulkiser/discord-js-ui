import { SlashCommandBuilder } from '@discordjs/builders'
import { Command } from '../types'
import { createSelectMenu } from '../../../components/select-menu'

export const menu: Command = {
  data: new SlashCommandBuilder().setName('menu').setDescription('Replies with a menu!'),
  execute: async (interaction) => {
    createSelectMenu(interaction, [
      {
        contents: 'option 1',
        label: 'Option 1',
        description: '',
      },
      {
        contents: 'option 2',
        label: 'Option 2',
        description: '',
      },
    ])
  },
}
