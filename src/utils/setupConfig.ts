import { createInterface } from "readline"
import { writeFile, readFile, access } from "fs/promises"
import { join } from "path"
import { config } from "dotenv"

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer)
    })
  })
}

const requiredEnvVars = [
  {
    key: "DISCORD_TOKEN",
    prompt: "Please enter your Discord Bot Token: ",
    info: "You can get this from https://discord.com/developers/applications",
  },
  {
    key: "CLIENT_ID",
    prompt: "Please enter your Discord Application Client ID: ",
    info: "You can find this in your Discord Application settings",
  },
  {
    key: "LAVALINK_PASSWORD",
    prompt: "Enter a password for Lavalink (or press enter for default): ",
    default: "youshallnotpass",
  },
]

export interface Config {
  token: string
  clientId: string
  lavalinkPassword: string
}

export const setupConfig = async (): Promise<Config> => {
  // Load environment variables
  config()

  // Check for required environment variables
  const token = process.env.DISCORD_TOKEN
  const clientId = process.env.CLIENT_ID
  const lavalinkPassword = process.env.LAVALINK_PASSWORD || 'youshallnotpass'

  if (!token || !clientId) {
    throw new Error('Missing required environment variables: DISCORD_TOKEN and CLIENT_ID must be set. Please add them in .env in the project (before deploying the docker container).')
  }

  return {
    token,
    clientId,
    lavalinkPassword
  }
}

