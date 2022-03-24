import {
  BaseCommandInteraction,
  Interaction,
  MessageActionRow,
  MessageEmbed,
  MessageSelectMenu,
} from 'discord.js'

import * as manager from '../../manager'
import {
  isSelectMenuOptionWithContents,
  isSelectMenuOptionWithEmbedAndContents,
  SelectMenuOption,
} from './types'

async function createSelectMenu(
  interaction: BaseCommandInteraction,
  options: SelectMenuOption[],
) {
  const client = interaction.client
  const id = manager.getNewId()

  const viewsList: Array<{
    contents?: string
    embed?: MessageEmbed | MessageEmbed[]
  }> = options.map((option: SelectMenuOption) => {
    if (isSelectMenuOptionWithEmbedAndContents(option)) {
      return {
        embed: option.embed,
        contents: option.contents,
      }
    }

    if (isSelectMenuOptionWithContents(option)) {
      return {
        contents: option.contents,
      }
    }

    return {
      embed: option.embed,
    }
  })

  const updateMenu = (defaultIndex?: number) => {
    return new MessageActionRow().addComponents(
      new MessageSelectMenu().setCustomId(id).addOptions([
        ...options.map((option, i) => {
          return {
            ...option,
            default: defaultIndex == i,
            value: `${i}`,
          }
        }),
      ]),
    )
  }
  const menu = updateMenu()

  const cb = (interaction: Interaction) => {
    if (!interaction.isSelectMenu()) return
    if (interaction.customId != id) return

    const currentId = parseInt(interaction.values[0], 10)
    const view = viewsList[currentId]

    interaction.update({
      content: view.contents || null,
      embeds: view.embed
        ? Array.isArray(view.embed)
          ? view.embed
          : [view.embed]
        : [],
      components: [updateMenu(currentId)],
    })

    manager.update(id)
  }

  client.on('interactionCreate', cb)
  manager.register(id, 'interactionCreate', cb)

  interaction.reply({
    components: [menu],
  })
}

export { SelectMenuOption, createSelectMenu }
