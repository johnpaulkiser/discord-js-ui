import { SlashCommandBuilder } from '@discordjs/builders'
import { Command } from '../types'
import { createSelectMenu, SelectMenuOption } from '../../../'
import { MessageEmbed } from 'discord.js'

export const menu: Command = {
  data: new SlashCommandBuilder()
    .setName('menu')
    .setDescription('Replies with a menu!'),
  execute: async (interaction) => {
    const views: SelectMenuOption[] = [
      {
        contents: 'option 1',
        embed: new MessageEmbed({
          title: 'Option 1',
        }),
        label: 'Option 1',
      },
      {
        contents: 'option 2',
        label: 'Option 2',
      },
      {
        label: 'Option 3',
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
        description: 'This is option 4 description',
        embed: [
          new MessageEmbed({
            title: 'Option 4',
          }),
          new MessageEmbed({
            title: 'Option 4',
          }),
        ],
      },
    ]

    createSelectMenu(interaction, views, {
      timeout: 45_000,
      ephemeral: true,
    })
  },
}
