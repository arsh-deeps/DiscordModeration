import {
  TextChannel,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  MessageComponentInteraction,
  ButtonStyle,
} from "discord.js";
import { OpenAI } from "openai";
import { MOD_LOG_CHANNEL } from "../config";
import { Message } from "discord.js";

export class ModerationService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  public async moderateMessage(message: Message): Promise<void> {
    const response = await this.openai.moderations.create({
      model: "omni-moderation-latest",
      input: message.content,
    });

    const result = response.results[0];
    const THRESHOLD = 0.4;
    const flaggedCategories = Object.entries(result.category_scores)
      .filter(([_, score]) => (score as number) > THRESHOLD)
      .map(([category]) => category);

    if (flaggedCategories.length > 0) {
      await this.logModeration(message, flaggedCategories);
    }
  }

  private async logModeration(
    message: Message,
    flaggedCategories: string[]
  ): Promise<void> {
    const logChannel = message.guild?.channels.cache.get(
      MOD_LOG_CHANNEL
    ) as TextChannel;
    if (logChannel) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("🚨 Message Flagged")
        .setDescription(
          `**User:** ${message.author.tag}\n**Message:** ${message.content}`
        )
        .addFields({ name: "Flags", value: flaggedCategories.join(", ") })
        .setTimestamp();

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("approve")
          .setEmoji("✅")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("reject")
          .setEmoji("🚫")
          .setStyle(ButtonStyle.Secondary)
      );

      const logMessage = await logChannel.send({
        embeds: [embed],
        components: [row],
      });

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
          await this.handleModeration(message, flaggedCategories);
          await interaction.reply({
            content: "Moderation approved.",
            ephemeral: true,
          });
          interaction.message.edit({
            embeds: [
              EmbedBuilder.from(interaction.message.embeds[0])
                .setFooter({
                  text: `Approved by ${
                    interaction.member?.nickname ||
                    interaction.member.displayName
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
  }

  private async handleModeration(
    message: Message,
    flaggedCategories: string[]
  ): Promise<void> {
    await message.delete();
    await this.sendDM(
      message.author,
      message.content,
      message.guild ? message.guild.name : "Unknown Server",
      flaggedCategories
    );
  }

  private async sendDM(
    user: any,
    messageContent: string,
    guildName: string,
    flaggedCategories: string[]
  ): Promise<void> {
    try {
      const dmEmbed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("🚨 Message Removed")
        .setDescription(
          `Your message in **${guildName}** was removed due to inappropriate content.`
        )
        .addFields(
          { name: "Message Content", value: messageContent },
          { name: "Reason", value: flaggedCategories.join(", ") },
          {
            name: "Warning",
            value: "Continued behavior can lead to further actions.",
          }
        )
        .setTimestamp();
      await user.send({ embeds: [dmEmbed] });
    } catch (err) {
      console.warn("⚠️ Could not DM the user.");
    }
  }
}
