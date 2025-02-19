import { SlashCommandBuilder, CommandInteraction } from "discord.js"
import type { LavalinkManager } from "lavalink-client"

export const data = new SlashCommandBuilder()
  .setName("volume")
  .setDescription("Set the volume of the music")
  .addIntegerOption(option =>
    option
      .setName("level")
      .setDescription("Volume level (0-100)")
      .setRequired(true)
      .setMinValue(0)
      .setMaxValue(100)
  )

export const execute = async (interaction: CommandInteraction, lavalink: LavalinkManager) => {
  const volume = interaction.options.get('level')?.value as number
  const player = lavalink.getPlayer(interaction.guildId!)
  
  if (!player) {
    return interaction.reply("There is no music playing.")
  }

  await player.setVolume(volume)
  return interaction.reply(`Set the volume to ${volume}%`)
}

