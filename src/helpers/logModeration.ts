import {
  TextChannel,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Message,
} from "discord.js";
import { MOD_LOG_CHANNEL } from "../config";
import { handleInteraction } from "./interactionHandler";

export async function logModeration(
  message: Message,
  flaggedCategories: string[]
): Promise<void> {
  const logChannel = message.guild?.channels.cache.get(
    MOD_LOG_CHANNEL
  ) as TextChannel;
  if (logChannel) {
    const embed = createLogEmbed(message, flaggedCategories);
    const row = createActionRow();

    const logMessage = await logChannel.send({
      embeds: [embed],
      components: [row],
    });

    handleInteraction(logMessage, message, flaggedCategories);
  }
}

function createLogEmbed(
  message: Message,
  flaggedCategories: string[]
): EmbedBuilder {
  return new EmbedBuilder()
    .setColor("Red")
    .setTitle("🚨 Message Flagged")
    .setDescription(
      `**User:** ${message.author.tag}\n**Message:** ${message.content}`
    )
    .addFields({ name: "Flags", value: flaggedCategories.join(", ") })
    .setFooter({ text: "Use ✅ to approve or 🚫 to reject the moderation." })
    .setTimestamp();
}

function createActionRow(): ActionRowBuilder<ButtonBuilder> {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("approve")
      .setEmoji("✅")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("reject")
      .setEmoji("🚫")
      .setStyle(ButtonStyle.Secondary)
  );
}
