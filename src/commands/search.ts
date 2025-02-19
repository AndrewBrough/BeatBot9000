import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from "discord.js"
import type { LavalinkManager } from "lavalink-client"
import { playTrack } from "../streaming/playTrack"

export const data = new SlashCommandBuilder()
  .setName("search")
  .setDescription("Search for a song")
  .addStringOption((option) =>
    option.setName("query").setDescription("The song you want to search for").setRequired(true)
  )

export const execute = async (interaction: CommandInteraction, lavalink: LavalinkManager) => {
  const query = interaction.options.get("query")?.value as string
  
  await interaction.deferReply()

  try {
    const results = await lavalink.searchTracks(query, {
      source: "ytsearch",
      requester: interaction.user
    })

    if (!results.tracks.length) {
      return interaction.editReply("No results found!")
    }

    const tracks = results.tracks.slice(0, 5)
    const embed = new EmbedBuilder()
      .setTitle("Search Results")
      .setDescription(
        tracks
          .map((track, i) => `${i + 1}. **${track.title}** (${track.duration})`)
          .join("\n")
      )
      .setColor(0x0099ff)

    await interaction.editReply({ embeds: [embed] })
  } catch (error) {
    console.error("Error searching:", error)
    return interaction.editReply("An error occurred while searching. Please try again later.")
  }
}

