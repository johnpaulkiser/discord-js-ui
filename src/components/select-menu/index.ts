import {
  BaseCommandInteraction,
  MessageActionRow,
  //   MessageEmbed,
  MessageSelectMenu,
  MessageSelectOptionData,
} from 'discord.js'

export type SelectMenuOption = {
  contents: string
} & Omit<MessageSelectOptionData, 'value'>

export async function createSelectMenu(interaction: BaseCommandInteraction, options: SelectMenuOption[]) {
  const client = interaction.client
  const contentsMap: Record<string, SelectMenuOption['contents']> = options.reduce((prev, curr, i) => {
    return {
      ...prev,
      [i]: curr.contents,
    }
  }, {})

  const updateMenu = (defaultIndex?: number) => {
    return new MessageActionRow().addComponents(
      new MessageSelectMenu().setCustomId('select').addOptions([
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

  client.on('interactionCreate', (interaction) => {
    if (!interaction.isSelectMenu()) return
    const selectedId = interaction.values[0]

    interaction.update({
      content: contentsMap[selectedId],
      components: [updateMenu(parseInt(selectedId, 10))],
    })
  })

  interaction.reply({
    components: [menu],
  })
}
