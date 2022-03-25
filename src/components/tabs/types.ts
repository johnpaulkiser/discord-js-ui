import { MessageButtonOptions } from 'discord.js'
import { MenuOption } from '../types'

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

export type TabMenuButton = MenuOption<Optional<MessageButtonOptions, 'style'>>
