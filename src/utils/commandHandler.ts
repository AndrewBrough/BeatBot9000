import { Client, REST, Routes } from "discord.js"
import fs from "fs"
import path from "path"

const commands: any[] = []
// Use .ts files in dev, .js files in production
const fileExtension = process.env.NODE_ENV === 'production' ? '.js' : '.ts'

console.log('Command directory:', path.join(__dirname, "../commands"))
console.log('Environment:', process.env.NODE_ENV)
console.log('Using file extension:', fileExtension)

const commandFiles = fs.readdirSync(path.join(__dirname, "../commands"))
  .filter((file) => file.endsWith(fileExtension))

console.log('Directory contents:', fs.readdirSync(path.join(__dirname, "../commands")))

for (const file of commandFiles) {
  try {
    const command = require(`../commands/${file}`)
    console.log(`Loading command from ${file}:`, command)
    commands.push(command.data.toJSON())
  } catch (error) {
    console.error(`Error loading command ${file}:`, error)
  }
}

export const registerCommands = async (client: Client) => {
  if (!client.user) {
    console.error('Client user is not initialized')
    return
  }
  
  console.log('Found command files:', commandFiles)
  console.log('Loaded commands:', commands)
  
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!)

  try {
    console.log('Started refreshing application (/) commands.')
    console.log(`Registering ${commands.length} commands for application ID: ${client.user.id}`)
    
    const data = await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    )
    
    console.log('Successfully reloaded application (/) commands.')
    console.log('Registered commands:', commands.map(c => c.name).join(', '))
  } catch (error) {
    console.error('Error registering commands:', error)
    if (error instanceof Error) {
      console.error('Error details:', error.message)
      console.error('Stack trace:', error.stack)
    }
  }
}

