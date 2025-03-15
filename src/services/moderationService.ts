import { Message } from "discord.js";
import { OpenAIModeration } from "./openaiModeration";
import { logModeration } from "../helpers/logModeration";

export class ModerationService {
  private openaiModeration: OpenAIModeration;

  constructor(apiKey: string) {
    this.openaiModeration = new OpenAIModeration(apiKey);
  }

  public async moderateMessage(message: Message): Promise<void> {
    const flaggedCategories = await this.openaiModeration.getFlaggedCategories(
      message.content
    );
    if (flaggedCategories.length > 0) {
      await logModeration(message, flaggedCategories);
    }
  }
}
