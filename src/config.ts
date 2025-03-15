import dotenv from "dotenv";
import { ModerationService } from "./services/moderationService";

dotenv.config();

const TOKEN = process.env.TOKEN!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const MOD_LOG_CHANNEL = process.env.MOD_LOG_CHANNEL!;

if (!TOKEN || !OPENAI_API_KEY || !MOD_LOG_CHANNEL) {
  console.error("Missing environment variables. Check .env file!");
  process.exit(1);
}

const moderationService = new ModerationService(OPENAI_API_KEY);

export { TOKEN, OPENAI_API_KEY, MOD_LOG_CHANNEL, moderationService };
