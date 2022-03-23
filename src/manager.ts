import { Client, Interaction } from 'discord.js'

type ListenerCallBack = (interaction: Interaction) => void | Promise<void>

type ListenerEntryType = Record<
  string,
  { listenerCallback: ListenerCallBack; eventName: string; timeout?: NodeJS.Timeout }
>

let client: Client

const listeners: ListenerEntryType = {}

const timeout = 20_000 // 20 seconds

export function register(id: string, eventName: string, callback: ListenerCallBack) {
  if (!client) {
    throw new Error(
      'UIManager not initialized, make sure to call UIManager.init(client) after your Discord.js Client object has initialized',
    )
  }

  listeners[id] = {
    listenerCallback: callback,
    eventName,
  }
}

export function update(id: string) {
  const listener = listeners[id]
  const { eventName, listenerCallback } = listener

  if (listener.timeout) {
    clearTimeout(listener.timeout as NodeJS.Timeout)
  }

  const timer = setTimeout(() => {
    client.removeListener(eventName, listenerCallback)
    delete listeners[id]
  }, timeout)

  listener.timeout = timer
}

/**
 *  Initializes discord-js-ui with the discord client - Must be called before using any components
 * @param discordClient
 */
function init(discordClient: Client) {
  client = discordClient
}

export const UIManager = {
  init,
}
