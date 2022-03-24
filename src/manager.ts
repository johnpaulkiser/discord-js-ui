import { Client } from 'discord.js'
import { ListenerCallBack, ListenerEntryType } from './types'

let client: Client
const listeners: ListenerEntryType = {}
let globalTimeout = 60_000
const INITIAL_TIMEOUT = 60_000 * 5

/**
 *  Initializes discord-js-ui with the discord client - Must be called before using any components
 */
function init(
  discordClient: Client,
  options?: {
    timeout?: number
  },
) {
  client = discordClient
  globalTimeout = options?.timeout || globalTimeout
}

export function register(
  id: string,
  eventName: string,
  callback: ListenerCallBack,
  userDefinedTimeout: number | undefined,
) {
  if (!client) {
    throw new Error(
      'UIManager not initialized, make sure to call UIManager.init(client)' +
        ' after your Discord.js Client object has initialized',
    )
  }

  //set initial timeout for when users never creates interaction
  const timer = setTimeout(() => {
    delete listeners[id]
    client.removeListener(eventName, callback)
  }, INITIAL_TIMEOUT)

  listeners[id] = {
    listenerCallback: callback,
    eventName,
    timeout: timer,
    userDefinedTimeout,
  }
}

export function update(id: string) {
  const listener = listeners[id]
  const { eventName, listenerCallback } = listener

  if (listener.timeout) {
    clearTimeout(listener.timeout as NodeJS.Timeout)
  }

  const timer = setTimeout(() => {
    delete listeners[id]
    client.removeListener(eventName, listenerCallback)
  }, listener.userDefinedTimeout || globalTimeout)

  listener.timeout = timer
}

export function getNewId() {
  if (!client) {
    throw new Error(
      'UIManager not initialized, make sure to call UIManager.init(client)' +
        ' after your Discord.js Client object has initialized',
    )
  }

  return Object.keys(listeners).length.toString()
}

export const UIManager = {
  init,
}
