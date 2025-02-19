import { createInterface } from "readline"
import { writeFile, readFile, access } from "fs/promises"
import { join } from "path"
import { config } from "dotenv"

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer)
    })
  })
}

const requiredEnvVars = [
  {
    key: "DISCORD_TOKEN",
    prompt: "Please enter your Discord Bot Token: ",
    info: "You can get this from https://discord.com/developers/applications",
  },
  {
    key: "CLIENT_ID",
    prompt: "Please enter your Discord Application Client ID: ",
    info: "You can find this in your Discord Application settings",
  },
  {
    key: "LAVALINK_PASSWORD",
    prompt: "Enter a password for Lavalink (or press enter for default): ",
    default: "youshallnotpass",
  },
]

export const setupConfig = async (): Promise<void> => {
  const envPath = join(process.cwd(), ".env")

  try {
    // Check if .env exists
    await access(envPath)
    // If it exists, load it and check if all required vars are present
    config()

    const missingVars = requiredEnvVars.filter(({ key }) => !process.env[key])

    if (missingVars.length === 0) {
      return // All required vars exist
    }

    console.log("Some required configuration is missing. Starting setup...")

    // Read existing .env content
    const existingEnv = await readFile(envPath, "utf-8")
    const envVars = new Map(
      existingEnv
        .split("\n")
        .filter((line) => line.includes("="))
        .map((line) => line.split("=") as [string, string]),
    )

    // Only prompt for missing variables
    for (const { key, prompt, info, default: defaultValue } of missingVars) {
      console.log(`\n${info || ""}`)
      const value = await question(prompt)
      envVars.set(key, value || defaultValue || "")
    }

    // Write back all variables
    const envContent = Array.from(envVars.entries())
      .map(([key, value]) => `${key}=${value}`)
      .join("\n")

    await writeFile(envPath, envContent)
  } catch (error) {
    // .env doesn't exist, create it from scratch
    console.log("Welcome to BeatBot! Let's set up your configuration.")

    const envVars = new Map()

    for (const { key, prompt, info, default: defaultValue } of requiredEnvVars) {
      console.log(`\n${info || ""}`)
      const value = await question(prompt)
      envVars.set(key, value || defaultValue || "")
    }

    // Add default Lavalink host and port
    envVars.set("LAVALINK_HOST", "localhost")
    envVars.set("LAVALINK_PORT", "2333")

    const envContent = Array.from(envVars.entries())
      .map(([key, value]) => `${key}=${value}`)
      .join("\n")

    await writeFile(envPath, envContent)
  }

  rl.close()

  // Reload environment variables
  config()

  console.log("\nConfiguration saved successfully! Starting bot...\n")
}

