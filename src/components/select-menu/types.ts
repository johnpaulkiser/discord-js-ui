import { MessageEmbed, MessageSelectOptionData } from 'discord.js'

type SelectMenuOptionBase = Omit<MessageSelectOptionData, 'value'>

export type SelectMenuOptionWithEmbed = {
  embed: MessageEmbed | MessageEmbed[]
} & SelectMenuOptionBase

export type SelectMenuOptionWithContents = {
  contents: string
} & SelectMenuOptionBase

export type SelectMenuOptionWithEmbedAndContent = {
  contents: string
  embed: MessageEmbed | MessageEmbed[]
} & SelectMenuOptionBase

export type SelectMenuOption =
  | SelectMenuOptionWithContents
  | SelectMenuOptionWithEmbed
  | SelectMenuOptionWithEmbedAndContent

export type SelectMenuConfig = {
  /*
   * Whether this component is only viewable to the interaction issuer or not
   */
  ephemeral?: boolean

  /*
   * How long this component will remain active and interactable between interactions
   */
  timeout?: number

  /*
   * Which view to show as selected first
   */
  startingIndex?: number
}

export type View = {
  contents?: string
  embed?: MessageEmbed | MessageEmbed[]
}

export function isSelectMenuOptionWithContents(
  option: SelectMenuOption,
): option is SelectMenuOptionWithContents {
  return (
    (option as any).contents !== undefined && (option as any).embed === undefined
  )
}

export function isSelectMenuOptionWithEmbed(
  option: SelectMenuOption,
): option is SelectMenuOptionWithEmbed {
  return (
    (option as any).embed !== undefined && (option as any).contents === undefined
  )
}

export function isSelectMenuOptionWithEmbedAndContents(
  option: SelectMenuOption,
): option is SelectMenuOptionWithEmbedAndContent {
  return (
    (option as any).embed !== undefined && (option as any).contents !== undefined
  )
}
