# BeatBot9000

BeatBot9000 is a Discord music bot that uses Lavalink for high-quality music playback. This README provides instructions on how to deploy the bot using Docker.

## Prerequisites

Before you begin, make sure you have the following installed on your system:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

You'll also need:

- A Discord Bot Token
- Your Discord Application Client ID

If you don't have these yet, follow these steps:

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click on "New Application" and give it a name
3. Go to the "Bot" tab and click "Add Bot"
4. Under the "Token" section, click "Copy" to get your bot token (you'll need this later)
5. Go to the "OAuth2" tab and copy the "Client ID" (you'll need this later)

## Deployment Steps

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/AndrewBrough/BeatBot9000.git
   cd BeatBot9000
   \`\`\`

2. Build and start the Docker container:
   \`\`\`bash
   docker-compose up --build
   \`\`\`

3. The first time you run the bot, it will prompt you for:
   - Your Discord Bot Token
   - Your Discord Application Client ID
   - A password for Lavalink (you can press enter to use the default)

   Enter these when prompted.

4. The bot will save your configuration and start automatically. You should see a message saying "Logged in as [Your Bot Name]!" when it's ready.

5. To stop the bot, press Ctrl+C in the terminal where it's running.

6. On subsequent runs, you can simply use:
   \`\`\`bash
   docker-compose up
   \`\`\`

## Updating the Bot

To update the bot to the latest version:

1. Stop the bot if it's running (Ctrl+C)
2. Pull the latest changes:
   \`\`\`bash
   git pull origin main
   \`\`\`
3. Rebuild and start the container:
   \`\`\`bash
   docker-compose up --build
   \`\`\`

## Troubleshooting

- If you need to change your configuration, you can either:
  - Delete the .env file in the Docker volume and restart the container
  - Use the bot's configuration update command (if implemented)

- If you're having issues with Lavalink, make sure port 2333 is not being used by another application on your system.

- For any other issues, check the bot's console output for error messages, and refer to the [GitHub Issues](https://github.com/AndrewBrough/BeatBot9000/issues) page for known problems and solutions.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

