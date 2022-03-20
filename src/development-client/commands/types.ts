import { SlashCommandBuilder } from '@discordjs/builders'
import { BaseCommandInteraction } from 'discord.js'

export interface Command {
  data: SlashCommandBuilder
  execute: (interaction: BaseCommandInteraction) => void
}
