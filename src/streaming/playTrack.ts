import type { CommandInteraction } from "discord.js"
import type { LavalinkManager } from "lavalink-client"

export const playTrack = async (interaction: CommandInteraction, lavalink: LavalinkManager, query: string) => {
  await interaction.deferReply()
  
  const member = interaction.member
  if (!member || !('voice' in member)) {
    return interaction.editReply("You need to be in a voice channel to play music!")
  }

  const voiceChannel = member.voice.channel
  if (!voiceChannel) {
    return interaction.editReply("You need to be in a voice channel to play music!")
  }

  try {
    // Get or create player
    const player = lavalink.getPlayer(interaction.guildId!) || lavalink.createPlayer({
      guildId: interaction.guildId!,
      voiceChannelId: voiceChannel.id,
      textChannelId: interaction.channelId,
    })

    // Connect to voice channel if not already connected
    if (!player.connected) await player.connect()

    // Search for the track
    const result = await lavalink.searchTracks(query, {
      source: "ytsearch",
      requester: interaction.user
    })

    if (!result.tracks.length) {
      return interaction.editReply("No results found!")
    }

    // Add the first track to the queue
    const track = result.tracks[0]
    player.queue.add(track)

    // If not playing, start playing
    if (!player.playing) await player.play()

    return interaction.editReply(`Added to queue: **${track.title}**`)
  } catch (error) {
    console.error("Error in playTrack:", error)
    return interaction.editReply("There was an error playing the track. Please try again later.")
  }
}

