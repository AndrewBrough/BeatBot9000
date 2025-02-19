import { SlashCommandBuilder, CommandInteraction } from "discord.js"
import type { LavalinkManager } from "lavalink-client"
import { playTrack } from "../streaming/playTrack"

export const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Play a song")
  .addStringOption(option =>
    option
      .setName("query")
      .setDescription("The song to play")
      .setRequired(true)
  )

export const execute = async (interaction: CommandInteraction, lavalink: LavalinkManager) => {
  const query = interaction.options.get('query')?.value as string
  await playTrack(interaction, lavalink, query)
}

