import type { CommandInteraction } from "discord.js"
import type { Manager } from "erela.js"

export const playTrack = async (interaction: CommandInteraction, manager: Manager, query: string) => {
  await interaction.deferReply()
  
  const member = interaction.member

  if (!member || !('voice' in member)) {
    return interaction.editReply("You need to be in a voice channel to play music!")
  }

  const voiceChannel = member.voice.channel

  try {
    // Check if we have any available nodes
    if (!manager.nodes.size) {
      console.error("No Lavalink nodes available")
      return interaction.editReply("Music system is not ready. Please try again in a moment.")
    }

    const player = manager.create({
      guild: interaction.guildId!,
      voiceChannel: voiceChannel?.id,
      textChannel: interaction.channelId,
    })

    if (player.state !== "CONNECTED") {
      try {
        await player.connect()
      } catch (err) {
        console.error("Failed to connect to voice channel:", err)
        return interaction.editReply("Failed to connect to voice channel. Please check if Lavalink is running properly.")
      }
    }

    const res = await manager.search(query, interaction.user)

    if (res.loadType === "LOAD_FAILED") {
      return interaction.editReply(`There was an error while searching: ${res.exception?.message}`)
    }

    if (res.loadType === "NO_MATCHES") {
      return interaction.editReply("There were no results found.")
    }

    const track = res.tracks[0]
    player.queue.add(track)

    if (!player.playing && !player.paused && !player.queue.size) {
      try {
        await player.play()
      } catch (err) {
        console.error("Failed to play track:", err)
        return interaction.editReply("Failed to play track. Please try again later.")
      }
    }

    return interaction.editReply(`Enqueued **${track.title}**`)
  } catch (err) {
    console.error("Error in playTrack:", err)
    return interaction.editReply("An error occurred while processing your request. Please try again later.")
  }
}

