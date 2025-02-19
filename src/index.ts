import { Client, GatewayIntentBits } from "discord.js"
import { Manager } from "erela.js"
import { config } from "dotenv"
import { registerCommands } from "./utils/commandHandler"
import { handleInteraction } from "./utils/interactionHandler"
import { setupConfig } from "./utils/setupConfig"

const initializeBot = async () => {
  // Load env variables first
  config()

  // Run setup if needed
  await setupConfig()

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  })

  const manager = new Manager({
    nodes: [
      {
        host: process.env.LAVALINK_HOST || "localhost",
        port: parseInt(process.env.LAVALINK_PORT || "2333"),
        password: process.env.LAVALINK_PASSWORD || "youshallnotpass",
        retryAmount: 5,        // Number of retries if connection fails
        retryDelay: 5000,      // Delay between retries in milliseconds
        secure: false,         // Use HTTP instead of HTTPS
      },
    ],
    send: (id, payload) => {
      const guild = client.guilds.cache.get(id)
      if (guild) guild.shard.send(payload)
    },
  })

  // Add debug listeners
  manager.on("nodeConnect", node => {
    console.log(`Node ${node.options.identifier || "default"} connected`)
  })

  manager.on("nodeError", (node, error) => {
    console.error(`Node ${node.options.identifier || "default"} had an error:`, error.message)
  })

  manager.on("nodeDisconnect", (node) => {
    console.warn(`Node ${node.options.identifier || "default"} disconnected. Attempting to reconnect...`)
    // Try to reconnect
    setTimeout(() => {
      node.connect()
    }, 5000)
  })

  manager.on("trackStart", (player, track) => {
    console.log(`Now playing: ${track.title}`)
  })

  client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`)
    console.log("Waiting for Lavalink to be ready...")
    
    // Wait a bit for Lavalink to be ready before initializing
    setTimeout(() => {
      manager.init(client.user!.id)
      console.log("Initialized Erela.js manager")
      registerCommands(client)

      const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${client.user!.id}&permissions=3214336&scope=bot%20applications.commands`
      console.log("\nAdd bot to your server:")
      console.log("\x1b[34m%s\x1b[0m", inviteUrl)
    }, 5000)  // Wait 5 seconds before connecting
  })

  client.on("raw", (d) => manager.updateVoiceState(d))

  client.on("interactionCreate", async (interaction) => {
    await handleInteraction(interaction, manager)
  })

  await client.login(process.env.DISCORD_TOKEN)
}

initializeBot().catch(console.error)

