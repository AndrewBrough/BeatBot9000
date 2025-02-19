import type { CommandInteraction } from "discord.js"
import type { Manager } from "erela.js"

export const playTrack = async (interaction: CommandInteraction, manager: Manager, query: string) => {
  const voiceChannel = interaction.member?.voice.channel

  if (!voiceChannel) {
    return interaction.reply("You need to be in a voice channel to play music!")
  }

  const player = manager.create({
    guild: interaction.guildId!,
    voiceChannel: voiceChannel.id,
    textChannel: interaction.channelId,
  })

  if (player.state !== "CONNECTED") player.connect()

  const res = await manager.search(query, interaction.user)

  if (res.loadType === "LOAD_FAILED") {
    return interaction.reply(`There was an error while searching: ${res.exception?.message}`)
  }

  if (res.loadType === "NO_MATCHES") {
    return interaction.reply("There were no results found.")
  }

  const track = res.tracks[0]
  player.queue.add(track)

  if (!player.playing && !player.paused && !player.queue.size) player.play()

  return interaction.reply(`Enqueued **${track.title}**`)
}

