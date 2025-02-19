import { SlashCommandBuilder } from "@discordjs/builders"
import type { CommandInteraction } from "discord.js"
import type { Manager } from "erela.js"

export const data = new SlashCommandBuilder()
  .setName("stop")
  .setDescription("Stop the music and leave the voice channel")

export const execute = async (interaction: CommandInteraction, manager: Manager) => {
  const player = manager.get(interaction.guildId!)

  if (!player) {
    return interaction.reply("There is no music playing.")
  }

  player.destroy()
  return interaction.reply("Stopped the music and left the voice channel.")
}

