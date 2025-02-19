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
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
  })

  const manager = new Manager({
    nodes: [
      {
        host: process.env.LAVALINK_HOST || "localhost",
        port: Number.parseInt(process.env.LAVALINK_PORT || "2333"),
        password: process.env.LAVALINK_PASSWORD || "youshallnotpass",
      },
    ],
    send: (id, payload) => {
      const guild = client.guilds.cache.get(id)
      if (guild) guild.shard.send(payload)
    },
  })

  client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`)
    manager.init(client.user!.id)
    registerCommands(client)
  })

  client.on("raw", (d) => manager.updateVoiceState(d))

  client.on("interactionCreate", async (interaction) => {
    await handleInteraction(interaction, manager)
  })

  await client.login(process.env.DISCORD_TOKEN)
}

initializeBot().catch(console.error)

