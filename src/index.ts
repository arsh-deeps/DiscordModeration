import { ModerationBot } from "./moderationBot";
import "./events/messageCreate";
import { buildSlashCommands } from "./helpers/slashCommandBuilder";

buildSlashCommands();

const bot = new ModerationBot();
bot.start();
