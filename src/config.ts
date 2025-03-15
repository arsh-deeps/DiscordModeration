import dotenv from "dotenv";
import { ModerationService } from "./services/moderationService";

dotenv.config();

const TOKEN = process.env.TOKEN!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const MOD_LOG_CHANNEL = process.env.MOD_LOG_CHANNEL!;
const CLIENT_ID = process.env.CLIENT_ID!;
const GUILD_ID = process.env.GUILD_ID!;
const MODERATOR_ROLE_ID = process.env.MODERATOR_ROLE_ID!;

if (
  !TOKEN ||
  !OPENAI_API_KEY ||
  !MOD_LOG_CHANNEL ||
  !CLIENT_ID ||
  !GUILD_ID ||
  !MODERATOR_ROLE_ID
) {
  console.error("Missing environment variables. Check .env file!");
  process.exit(1);
}

const OPENAI_MODERATION_THRESHOLD = 0.35;
const OPENAI_MODERATION_MODEL = "omni-moderation-latest";

const moderationService = new ModerationService(OPENAI_API_KEY);

export {
  TOKEN,
  OPENAI_API_KEY,
  MOD_LOG_CHANNEL,
  OPENAI_MODERATION_THRESHOLD,
  OPENAI_MODERATION_MODEL,
  moderationService,
  CLIENT_ID,
  GUILD_ID,
  MODERATOR_ROLE_ID,
};
