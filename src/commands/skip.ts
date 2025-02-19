import { SlashCommandBuilder, CommandInteraction } from "discord.js"
import type { LavalinkManager } from "lavalink-client"

export const data = new SlashCommandBuilder()
  .setName("skip")
  .setDescription("Skip the current song")

export const execute = async (interaction: CommandInteraction, lavalink: LavalinkManager) => {
  const player = lavalink.getPlayer(interaction.guildId!)
  
  if (!player) {
    return interaction.reply("There is no music playing.")
  }

  await player.skip()
  return interaction.reply("Skipped the current song!")
}

