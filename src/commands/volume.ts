import { SlashCommandBuilder } from "@discordjs/builders"
import type { CommandInteraction } from "discord.js"
import type { Manager } from "erela.js"

export const data = new SlashCommandBuilder()
  .setName("volume")
  .setDescription("Set the volume of the music")
  .addIntegerOption((option) =>
    option.setName("level").setDescription("Volume level (0-100)").setRequired(true).setMinValue(0).setMaxValue(100),
  )

export async function volume(interaction: CommandInteraction, manager: Manager) {
  if (!interaction.isCommand()) return;

  const volume = interaction.options.get('level')?.value as number;
  if (volume === undefined) {
    await interaction.reply('Please provide a volume level');
    return;
  }

  const player = manager.get(interaction.guildId!)

  if (!player) {
    return interaction.reply("There is no music playing.")
  }

  player.setVolume(volume)
  return interaction.reply(`Set the volume to ${volume}%`)
}

