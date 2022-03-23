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

export type SelectMenuOptions = Array<
  | SelectMenuOptionWithContents
  | SelectMenuOptionWithEmbed
  | SelectMenuOptionWithEmbedAndContent
>

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
