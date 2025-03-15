import { ModerationBot } from "./moderationBot";
import "./events/messageCreate";

const bot = new ModerationBot();
bot.start();
