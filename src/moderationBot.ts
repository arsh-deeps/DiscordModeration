import { client } from "./client";
import { MessageCreateEventHandler } from "./events/messageCreate";
import { moderationService, TOKEN } from "./config";
import { ManualModeration } from "./services/manualModeration";

export class ModerationBot {
  private messageCreateEventHandler: MessageCreateEventHandler;
  private manualModeration: ManualModeration;

  constructor() {
    this.messageCreateEventHandler = new MessageCreateEventHandler(
      moderationService
    );
    this.manualModeration = new ManualModeration();
    this.initialize();
  }

  private initialize() {
    client.on("messageCreate", (message) =>
      this.messageCreateEventHandler.handleMessageCreate(message)
    );
  }

  public start() {
    client.login(TOKEN);
  }
}
