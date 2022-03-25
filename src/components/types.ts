import { MessageEmbed } from 'discord.js'

type MenuOptionBase<T> = Omit<T, 'value' | 'customId' | 'type'>

export type MenuOptionWithEmbed<T> = {
  embed: MessageEmbed | MessageEmbed[]
} & MenuOptionBase<T>

export type MenuOptionWithContents<T> = {
  contents: string
} & MenuOptionBase<T>

export type MenuOptionWithEmbedAndContent<T> = {
  contents: string
  embed: MessageEmbed | MessageEmbed[]
} & MenuOptionBase<T>

export type MenuOption<T> =
  | MenuOptionWithContents<T>
  | MenuOptionWithEmbed<T>
  | MenuOptionWithEmbedAndContent<T>

export function isMenuOptionWithContents<T>(
  option: MenuOption<T>,
): option is MenuOptionWithContents<T> {
  return (
    (option as any).contents !== undefined && (option as any).embed === undefined
  )
}

export function isMenuOptionWithEmbed<T>(
  option: MenuOption<T>,
): option is MenuOptionWithEmbed<T> {
  return (
    (option as any).embed !== undefined && (option as any).contents === undefined
  )
}

export function isMenuOptionWithEmbedAndContents<T>(
  option: MenuOption<T>,
): option is MenuOptionWithEmbedAndContent<T> {
  return (
    (option as any).embed !== undefined && (option as any).contents !== undefined
  )
}

export type View = {
  contents?: string
  embed?: MessageEmbed | MessageEmbed[]
}

export type MenuConfig = {
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
