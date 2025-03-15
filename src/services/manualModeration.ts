import {
  Interaction,
  GuildMemberRoleManager,
  ChatInputCommandInteraction,
  TextChannel,
  Message,
} from "discord.js";
import { client } from "../client";
import { handleModeration } from "../helpers/moderationHandler";
import { MODERATED_CHANNELS, MODERATOR_ROLE_ID } from "../config";

export class ManualModeration {
  constructor() {
    client.on("interactionCreate", async (interaction) => {
      if (
        !interaction.isCommand() ||
        !(interaction instanceof ChatInputCommandInteraction) ||
        interaction.commandName !== "moderate"
      )
        return;

      if (
        !(interaction.member?.roles instanceof GuildMemberRoleManager) ||
        !interaction.member.roles.cache.has(MODERATOR_ROLE_ID)
      ) {
        await interaction.reply({
          content: "You do not have permission to use this command.",
          ephemeral: true,
        });
        return;
      }

      const messageId = interaction.options.getString("message_id", true);
      const reason =
        interaction.options.getString("reason") || "No reason provided";
      interaction.deferReply();

      try {
        const message = await this.fetchMessageById(messageId);
        if (!message) {
          await interaction.followUp({
            content: "Message not found in any accessible channel.",
            ephemeral: true,
          });
          return;
        }

        await handleModeration(message, reason);
        await interaction.followUp({
          content: `Message moderated successfully.`,
          ephemeral: true,
        });
      } catch (error) {
        console.error("Error moderating message:", error);
        await interaction.followUp({
          content: "An error occurred while moderating the message.",
          ephemeral: true,
        });
      }
    });
  }

  private async fetchMessageById(messageId: string): Promise<Message | null> {
    for (const channel of client.channels.cache.values()) {
      if (MODERATED_CHANNELS.includes(channel.id)) {
        try {
          const message = await (channel as TextChannel).messages.fetch(
            messageId
          );
          if (message) return message;
        } catch {
          continue;
        }
      }
    }
    return null;
  }
}
