import { Interaction } from 'discord.js'

export type ListenerCallBack = (interaction: Interaction) => void | Promise<void>

export type ListenerEntryType = Record<
  string,
  { listenerCallback: ListenerCallBack; eventName: string; timeout: NodeJS.Timeout }
>
