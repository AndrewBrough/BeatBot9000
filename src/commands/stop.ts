import { SlashCommandBuilder, CommandInteraction } from "discord.js"
import type { LavalinkManager } from "lavalink-client"

export const data = new SlashCommandBuilder()
  .setName("stop")
  .setDescription("Stop the music and leave the voice channel")

export const execute = async (interaction: CommandInteraction, lavalink: LavalinkManager) => {
  const player = lavalink.getPlayer(interaction.guildId!)
  
  if (!player) {
    return interaction.reply("There is no music playing.")
  }

  await player.destroy()
  return interaction.reply("Stopped the music and left the channel!")
}

