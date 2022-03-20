import { config } from 'dotenv'
config()

export const token = process.env['SECRET_TOKEN'] || ''
export const guildId = process.env['GUILD_ID'] || ''
export const clientId = process.env['CLIENT_ID'] || ''
