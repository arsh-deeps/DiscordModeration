import { TextChannel, EmbedBuilder } from "discord.js";
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
      await this.handleModeration(message, flaggedCategories);
    }
  }

  private async handleModeration(
    message: Message,
    flaggedCategories: string[]
  ): Promise<void> {
    await message.delete();
    await this.sendDM(message.author, message.content, flaggedCategories);
    await this.logModeration(message, flaggedCategories);
  }

  private async sendDM(
    user: any,
    messageContent: string,
    flaggedCategories: string[]
  ): Promise<void> {
    try {
      const dmEmbed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("🚨 Message Removed")
        .setDescription(
          `Your message in **${user.guild?.name}** was removed due to inappropriate content.`
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
        .setTitle("🚨 Message Removed")
        .setDescription(
          `**User:** ${message.author.tag}\n**Message:** ${message.content}`
        )
        .addFields({ name: "Flags", value: flaggedCategories.join(", ") })
        .setTimestamp();
      await logChannel.send({ embeds: [embed] });
    }
  }
}
