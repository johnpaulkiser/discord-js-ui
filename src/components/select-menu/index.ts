import { randomUUID } from 'crypto'
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
  const id = randomUUID()

  const contentsMap: Record<
    string,
    { contents?: string; embed?: MessageEmbed | MessageEmbed[] }
  > = options.reduce((prev, curr, i) => {
    if (isSelectMenuOptionWithEmbedAndContents(curr)) {
      return {
        ...prev,
        [i]: {
          embed: curr.embed,
          contents: curr.contents,
        },
      }
    }

    if (isSelectMenuOptionWithContents(curr)) {
      return {
        ...prev,
        [i]: {
          contents: curr.contents,
        },
      }
    }

    return {
      ...prev,
      [i]: {
        embed: curr.embed,
      },
    }
  }, {})

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

    const selectedId = interaction.values[0]
    const view = contentsMap[selectedId]

    interaction.update({
      content: view.contents || null,
      embeds: view.embed
        ? Array.isArray(view.embed)
          ? view.embed
          : [view.embed]
        : [],
      components: [updateMenu(parseInt(selectedId, 10))],
    })

    manager.update(id)
  }

  client.on('interactionCreate', cb)
  manager.register(id, 'interactionCreate', cb)

  console.log(client.listenerCount('interactionCreate'))

  interaction.reply({
    components: [menu],
  })
}

export { SelectMenuOption, createSelectMenu }
