import {
  BaseCommandInteraction,
  Interaction,
  MessageActionRow,
  MessageSelectMenu,
} from 'discord.js'

import * as manager from '../../manager'
import {
  isSelectMenuOptionWithContents,
  isSelectMenuOptionWithEmbedAndContents,
  SelectMenuConfig,
  SelectMenuOption,
  View,
} from './types'

async function createSelectMenu(
  interaction: BaseCommandInteraction,
  options: SelectMenuOption[],
  config: SelectMenuConfig = {},
) {
  const client = interaction.client
  const id = manager.getNewId()

  if (
    config.startingIndex &&
    (config.startingIndex >= options.length || config.startingIndex < 0)
  ) {
    throw new Error("startingIndex must be within select-menu's options' range.")
  }

  const viewsList: View[] = options.map((option: SelectMenuOption) => {
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
  const menu = updateMenu(config.startingIndex)

  const cb = (interaction: Interaction) => {
    if (!interaction.isSelectMenu()) return
    if (interaction.customId != id) return

    const currentId = parseInt(interaction.values[0], 10)

    interaction.update({
      ...getCurrentViewObj(viewsList, currentId),
      components: [updateMenu(currentId)],
    })

    manager.update(id)
  }

  client.on('interactionCreate', cb)
  manager.register(id, 'interactionCreate', cb, config.timeout)

  interaction.reply({
    ...getCurrentViewObj(viewsList, config.startingIndex),
    components: [menu],
    ephemeral: config.ephemeral,
  })
}

const getCurrentViewObj = (viewList: View[], index?: number) => {
  if (index == undefined) return {}

  const view = viewList[index]
  return {
    content: view.contents || null,
    embeds: view.embed
      ? Array.isArray(view.embed)
        ? view.embed
        : [view.embed]
      : [],
  }
}

export { SelectMenuOption, createSelectMenu }
