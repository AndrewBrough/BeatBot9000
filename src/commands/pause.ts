import { SlashCommandBuilder, CommandInteraction } from "discord.js"
import type { LavalinkManager } from "lavalink-client"

export const data = new SlashCommandBuilder()
  .setName("pause")
  .setDescription("Pause the current song")

export const execute = async (interaction: CommandInteraction, lavalink: LavalinkManager) => {
  const player = lavalink.getPlayer(interaction.guildId!)
  
  if (!player) {
    return interaction.reply("There is no music playing.")
  }

  await player.pause()
  return interaction.reply("Paused the music!")
}

