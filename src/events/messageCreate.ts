import { Message } from "discord.js";
import { ModerationService } from "../services/moderationService";
import { MODERATED_CHANNELS } from "../config";

export class MessageCreateEventHandler {
  private moderationService: ModerationService;

  constructor(moderationService: ModerationService) {
    this.moderationService = moderationService;
  }

  public async handleMessageCreate(message: Message) {
    if (message.author.bot) return;
    if (!MODERATED_CHANNELS.includes(message.channel.id)) return;

    try {
      await this.moderationService.moderateMessage(message);
    } catch (error) {
      console.error("❌ Error processing message moderation:", error);
    }
  }
}
