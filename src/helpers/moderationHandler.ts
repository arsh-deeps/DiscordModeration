import { Message } from "discord.js";
import { sendDM } from "./dmSender";

export async function handleModeration(
  message: Message,
  reason: string
): Promise<void> {
  await message.delete();
  await sendDM(
    message.author,
    message.content,
    message.guild ? message.guild.name : "Unknown Server",
    reason
  );
}
