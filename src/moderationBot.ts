import { client } from "./client";
import { MessageCreateEventHandler } from "./events/messageCreate";
import { moderationService, TOKEN } from "./config";

export class ModerationBot {
  private messageCreateEventHandler: MessageCreateEventHandler;

  constructor() {
    this.messageCreateEventHandler = new MessageCreateEventHandler(
      moderationService
    );
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
