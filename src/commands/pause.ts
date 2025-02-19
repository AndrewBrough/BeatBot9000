import { SlashCommandBuilder } from "@discordjs/builders"
import type { CommandInteraction } from "discord.js"
import type { Manager } from "erela.js"

export const data = new SlashCommandBuilder().setName("pause").setDescription("Pause the current song")

export const execute = async (interaction: CommandInteraction, manager: Manager) => {
  const player = manager.get(interaction.guildId!)

  if (!player) {
    return interaction.reply("There is no music playing.")
  }

  player.pause(true)
  return interaction.reply("Paused the music.")
}

