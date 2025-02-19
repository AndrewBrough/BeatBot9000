import { SlashCommandBuilder } from "@discordjs/builders"
import type { CommandInteraction } from "discord.js"
import type { Manager } from "erela.js"
import { playTrack } from "../streaming/playTrack"

export const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Play a song")
  .addStringOption((option) => option.setName("query").setDescription("The song you want to play").setRequired(true))

export const execute = async (interaction: CommandInteraction, manager: Manager) => {
  const query = interaction.options.getString("query")
  if (query) {
    await playTrack(interaction, manager, query)
  }
}

