import fs from "fs"
import path from "path"
import type { Interaction } from "discord.js"
import type { Manager } from "erela.js"

const commands = new Map()
const commandFiles = fs.readdirSync(path.join(__dirname, "../commands")).filter((file) => file.endsWith(".ts"))

for (const file of commandFiles) {
  const command = require(`../commands/${file}`)
  commands.set(command.data.name, command)
}

export const handleInteraction = async (interaction: Interaction, manager: Manager) => {
  if (!interaction.isCommand()) return

  const command = commands.get(interaction.commandName)

  if (!command) return

  try {
    await command.execute(interaction, manager)
  } catch (error) {
    console.error(error)
    await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true })
  }
}

