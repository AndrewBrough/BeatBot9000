import fs from "fs"
import path from "path"
import type { Interaction } from "discord.js"
import type { Manager } from "erela.js"

const commands = new Map()
const commandFiles = fs.readdirSync(path.join(__dirname, "../commands"))
  .filter((file) => file.endsWith(process.env.NODE_ENV === 'production' ? '.js' : '.ts'))

for (const file of commandFiles) {
  const command = require(`../commands/${file}`)
  commands.set(command.data.name, command)
}

export const handleInteraction = async (interaction: Interaction, manager: Manager) => {
  if (!interaction.isCommand()) return

  const command = commands.get(interaction.commandName)

  if (!command) {
    console.warn(`Command not found: ${interaction.commandName}`)
    return
  }

  try {
    await command.execute(interaction, manager)
  } catch (error) {
    console.error(error)
    // Only reply if we haven't replied yet
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ 
        content: 'There was an error executing this command!',
        ephemeral: true
      })
    }
  }
}

