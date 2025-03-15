import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { TOKEN, CLIENT_ID, GUILD_ID } from "../config";
import { SlashCommandBuilder } from "discord.js";

export const buildSlashCommands = () => {
  const moderateMessageCommand = new SlashCommandBuilder()
    .setName("moderate")
    .setDescription("Moderate a message by ID")
    .addStringOption((option) =>
      option
        .setName("message_id")
        .setDescription("The ID of the message to moderate")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("The reason for moderation")
    );

  const commands = [moderateMessageCommand.toJSON()];

  const rest = new REST({ version: "9" }).setToken(TOKEN);

  (async () => {
    try {
      console.log("Started refreshing application (/) commands.");

      await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
        body: commands,
      });

      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error(error);
    }
  })();
};
