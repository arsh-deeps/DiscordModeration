import {
  OPENAI_MODERATION_MODEL,
  OPENAI_MODERATION_THRESHOLD,
} from "../config";
import { OpenAI } from "openai";

export class OpenAIModeration {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  public async getFlaggedCategories(content: string): Promise<string[]> {
    const response = await this.openai.moderations.create({
      model: OPENAI_MODERATION_MODEL,
      input: content,
    });

    return Object.entries(response.results[0].category_scores)
      .filter(([_, score]) => (score as number) > OPENAI_MODERATION_THRESHOLD)
      .map(([category]) => category);
  }
}
