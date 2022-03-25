import {
  CommandInteraction,
  Interaction,
  MessageActionRow,
  MessageButton,
  MessageButtonOptions,
} from 'discord.js'

import * as manager from '../../manager'
import {
  isMenuOptionWithContents,
  isMenuOptionWithEmbedAndContents,
  MenuConfig,
  View,
} from '../types'
import { TabMenuButton } from './types'

async function createTabMenu(
  interaction: CommandInteraction,
  buttons: TabMenuButton[],
  config: MenuConfig = {},
) {
  const client = interaction.client
  const id = manager.getNewId()
  let index = config.startingIndex

  if (
    config.startingIndex &&
    (config.startingIndex >= buttons.length || config.startingIndex < 0)
  ) {
    throw new Error("startingIndex must be within select-menu's options' range.")
  }

  const viewsList: View[] = buttons.map((option: TabMenuButton) => {
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

  const updateMenu = (selected?: number) => {
    return new MessageActionRow().addComponents([
      ...buttons.map(
        (button, i) =>
          new MessageButton({
            ...button,
            customId: `${id}-${i}`,
            disabled: selected == i,
            style: button.style || 'SECONDARY',
          } as MessageButtonOptions),
      ),
    ])
  }

  const menu = updateMenu(config.startingIndex)

  const rehydrate = () => {
    if (index == undefined) return
    interaction.editReply({
      ...getCurrentViewObj(viewsList, index),
    })
  }

  const cb = (interaction: Interaction) => {
    if (!interaction.isButton()) return

    const [componentId, i] = interaction.customId.split('-')
    if (componentId != id) return

    index = parseInt(i, 10)

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

export { TabMenuButton, createTabMenu }
