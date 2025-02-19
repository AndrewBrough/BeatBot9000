import { SlashCommandBuilder } from "@discordjs/builders"
import type { CommandInteraction } from "discord.js"
import type { Manager } from "erela.js"

export const data = new SlashCommandBuilder().setName("skip").setDescription("Skip the current song")

export const execute = async (interaction: CommandInteraction, manager: Manager) => {
  const player = manager.get(interaction.guildId!)

  if (!player) {
    return interaction.reply("There is no music playing.")
  }

  player.stop()
  return interaction.reply("Skipped the song.")
}

