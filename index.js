const { Client, GatewayIntentBits } = require("discord.js")
const { Manager } = require("erela.js")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
})

const manager = new Manager({
  nodes: [
    {
      host: process.env.LAVALINK_HOST || "localhost",
      port: Number.parseInt(process.env.LAVALINK_PORT) || 2333,
      password: process.env.LAVALINK_PASSWORD || "youshallnotpass",
    },
  ],
  send: (id, payload) => {
    const guild = client.guilds.cache.get(id)
    if (guild) guild.shard.send(payload)
  },
})

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
  manager.init(client.user.id)
})

client.on("raw", (d) => manager.updateVoiceState(d))

const commands = [
  {
    name: "play",
    description: "Play a song",
    options: [
      {
        name: "query",
        type: 3,
        description: "The song you want to play",
        required: true,
      },
    ],
  },
  {
    name: "pause",
    description: "Pause the current song",
  },
  {
    name: "skip",
    description: "Skip the current song",
  },
]

const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN)
;(async () => {
  try {
    console.log("Started refreshing application (/) commands.")

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands })

    console.log("Successfully reloaded application (/) commands.")
  } catch (error) {
    console.error(error)
  }
})()

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return

  const { commandName } = interaction

  if (commandName === "play") {
    const query = interaction.options.getString("query")
    const voiceChannel = interaction.member.voice.channel

    if (!voiceChannel) {
      return interaction.reply("You need to be in a voice channel to play music!")
    }

    const player = manager.create({
      guild: interaction.guildId,
      voiceChannel: voiceChannel.id,
      textChannel: interaction.channelId,
    })

    if (player.state !== "CONNECTED") player.connect()

    const res = await manager.search(query, interaction.user)

    if (res.loadType === "LOAD_FAILED") {
      return interaction.reply(`There was an error while searching: ${res.exception.message}`)
    }

    if (res.loadType === "NO_MATCHES") {
      return interaction.reply("There were no results found.")
    }

    const track = res.tracks[0]
    player.queue.add(track)

    if (!player.playing && !player.paused && !player.queue.size) player.play()

    return interaction.reply(`Enqueued **${track.title}**`)
  } else if (commandName === "pause") {
    const player = manager.get(interaction.guildId)

    if (!player) {
      return interaction.reply("There is no music playing.")
    }

    player.pause(true)
    return interaction.reply("Paused the music.")
  } else if (commandName === "skip") {
    const player = manager.get(interaction.guildId)

    if (!player) {
      return interaction.reply("There is no music playing.")
    }

    player.stop()
    return interaction.reply("Skipped the song.")
  }
})

client.login(process.env.DISCORD_TOKEN)

