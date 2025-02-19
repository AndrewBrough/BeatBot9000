import { SlashCommandBuilder } from "discord.js"
import { CommandInteraction } from "discord.js"
import { Manager } from "erela.js"
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

export const execute = async (interaction: CommandInteraction, manager: Manager) => {
  try {
    const query = interaction.options.get('query')?.value as string
    await playTrack(interaction, manager, query)
  } catch (error) {
    // Only reply if we haven't replied yet
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ 
        content: 'There was an error executing this command!',
        ephemeral: true  // This makes the response only visible to the command user
      })
    }
  }
}

