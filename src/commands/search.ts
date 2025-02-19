import { SlashCommandBuilder } from "@discordjs/builders"
import { type CommandInteraction, EmbedBuilder, Message, type MessageReaction, type User } from "discord.js"
import type { Manager } from "erela.js"
import { searchTracks } from "../streaming/searchTracks"
import { playTrack } from "../streaming/playTrack"

export const data = new SlashCommandBuilder()
  .setName("search")
  .setDescription("Search for a song")
  .addStringOption((option) =>
    option.setName("query").setDescription("The song you want to search for").setRequired(true),
  )

export const execute = async (interaction: CommandInteraction, manager: Manager) => {
  if (!interaction.isCommand()) return;

  const query = interaction.options.get('query')?.value as string;
  if (!query) {
    await interaction.reply('Please provide a search query');
    return;
  }

  const results = await searchTracks(manager, query)

  if (results.length === 0) {
    return interaction.reply("No results found.")
  }

  const embed = new EmbedBuilder()
    .setTitle("Search Results")
    .setDescription(results.map((track, index) => `${index + 1}. ${track.title}`).join("\n"))
    .setFooter({ text: "React with 1-5 to select a song" })

  const message = await interaction.reply({ embeds: [embed], fetchReply: true })

  if (!(message instanceof Message)) {
    return
  }

  const filter = (reaction: MessageReaction, user: User) => {
    return ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"].includes(reaction.emoji.name!) && user.id === interaction.user.id
  }

  try {
    const collected = await message.awaitReactions({ filter, max: 1, time: 30000, errors: ["time"] })
    const reaction = collected.first()

    if (!reaction) throw new Error("No reaction collected")

    const index = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"].indexOf(reaction.emoji.name!)
    const selectedTrack = results[index]

    await playTrack(interaction, manager, selectedTrack.uri)
  } catch (error) {
    await interaction.followUp("No selection was made.")
  }
}

