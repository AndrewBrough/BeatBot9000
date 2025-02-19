import { Client, GatewayIntentBits } from "discord.js"
import { LavalinkManager } from "lavalink-client"
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

  const lavalink = new LavalinkManager({
    nodes: [
      {
        host: process.env.LAVALINK_HOST || "localhost",
        port: parseInt(process.env.LAVALINK_PORT || "2333"),
        password: process.env.LAVALINK_PASSWORD || "youshallnotpass",
        secure: false,
      }
    ],
    sendToShard: (guildId, payload) => {
      const guild = client.guilds.cache.get(guildId)
      if (guild) guild.shard.send(payload)
    },
    client: {
      id: process.env.CLIENT_ID!,
      username: "BeatBot9000"
    },
    autoResume: true,
    playerOptions: {
      onEmptyQueue: {
        destroyAfterMs: 30_000, // 30 seconds
      },
    },
  })

  // Add debug listeners
  lavalink.on("nodeConnect", (node) => {
    console.log(`Node ${node.host} connected`)
  })

  lavalink.on("nodeError", (node, error) => {
    console.error(`Node ${node.host} had an error:`, error.message)
  })

  lavalink.on("nodeDisconnect", (node) => {
    console.warn(`Node ${node.host} disconnected`)
  })

  lavalink.on("trackStart", (player, track) => {
    console.log(`Now playing: ${track.title}`)
  })

  client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`)
    registerCommands(client)

    const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${client.user!.id}&permissions=3214336&scope=bot%20applications.commands`
    console.log("\nAdd bot to your server:")
    console.log("\x1b[34m%s\x1b[0m", inviteUrl)
  })

  client.on("raw", (d) => lavalink.handleVoiceUpdate(d))

  client.on("interactionCreate", async (interaction) => {
    await handleInteraction(interaction, lavalink)
  })

  await client.login(process.env.DISCORD_TOKEN)
}

initializeBot().catch(console.error)

