import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"
import fs from "fs"
import path from "path"
import type { Client } from "discord.js"

const commands: any[] = []
const commandFiles = fs.readdirSync(path.join(__dirname, "../commands")).filter((file) => file.endsWith(".ts"))

for (const file of commandFiles) {
  const command = require(`../commands/${file}`)
  commands.push(command.data.toJSON())
}

export const registerCommands = async (client: Client) => {
  const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN!)

  try {
    console.log("Started refreshing application (/) commands.")

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), { body: commands })

    console.log("Successfully reloaded application (/) commands.")
  } catch (error) {
    console.error(error)
  }
}

