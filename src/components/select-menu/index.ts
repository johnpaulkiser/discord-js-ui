import {
  CommandInteraction,
  Interaction,
  MessageActionRow,
  MessageSelectMenu,
} from 'discord.js'

import * as manager from '../../manager'
import {
  isMenuOptionWithContents,
  isMenuOptionWithEmbedAndContents,
  View,
  MenuConfig,
} from '../types'
import { SelectMenuOption } from './types'

async function createSelectMenu(
  interaction: CommandInteraction,
  options: SelectMenuOption[],
  config: MenuConfig = {},
) {
  const client = interaction.client
  const id = manager.getNewId()
  let index = config.startingIndex

  if (
    config.startingIndex &&
    (config.startingIndex >= options.length || config.startingIndex < 0)
  ) {
    throw new Error("startingIndex must be within select-menu's options' range.")
  }

  const viewsList: View[] = options.map((option: SelectMenuOption) => {
    if (isMenuOptionWithEmbedAndContents(option)) {
      return {
        embed: option.embed,
        contents: option.contents,
      }
    }

    if (isMenuOptionWithContents(option)) {
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

  const rehydrate = () => {
    if (index == undefined) return
    interaction.editReply({
      ...getCurrentViewObj(viewsList, index),
    })
  }

  const cb = (interaction: Interaction) => {
    if (!interaction.isSelectMenu()) return
    if (interaction.customId != id) return

    index = parseInt(interaction.values[0], 10)

    interaction.update({
      ...getCurrentViewObj(viewsList, index),
      components: [updateMenu(index)],
    })

    manager.update(id)
  }

  client.on('interactionCreate', cb)
  manager.register(id, 'interactionCreate', cb, config.timeout)

  interaction.reply({
    ...getCurrentViewObj(viewsList, index),
    components: [menu],
    ephemeral: config.ephemeral,
  })

  return { views: viewsList, rehydrate }
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
