import { Message, MessageComponentInteraction, EmbedBuilder } from "discord.js";
import { handleModeration } from "./moderationHandler";

export function handleInteraction(
  logMessage: Message,
  message: Message,
  flaggedCategories: string[]
): void {
  const filter = (interaction: MessageComponentInteraction) =>
    ["approve", "reject"].includes(interaction.customId) &&
    !interaction.user.bot;

  const collector = logMessage.createMessageComponentCollector({
    filter,
    max: 1,
    time: 36_000_000, // 10 hours
  });

  collector.on("collect", async (interaction) => {
    if (interaction.customId === "approve") {
      await handleModeration(message, flaggedCategories.join(", "));
      await interaction.reply({
        content: "Moderation approved.",
        ephemeral: true,
      });
      interaction.message.edit({
        embeds: [
          EmbedBuilder.from(interaction.message.embeds[0])
            .setFooter({
              text: `Approved by ${
                interaction.user.displayName || interaction.user.username
              }`,
            })
            .setTimestamp()
            .toJSON(),
        ],
        components: [],
      });
    } else {
      await interaction.reply({
        content: "Moderation rejected.",
        ephemeral: true,
      });
      interaction.message.delete();
    }
    collector.stop();
  });

  collector.on("end", async (collected) => {
    if (collected.size === 0) {
      await logMessage.reply("No action taken within the time limit.");
    }
  });
}
