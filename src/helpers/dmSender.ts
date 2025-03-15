import { EmbedBuilder } from "discord.js";

export async function sendDM(
  user: any,
  messageContent: string,
  guildName: string,
  reason: string
): Promise<void> {
  try {
    const dmEmbed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("🚨 Message Removed")
      .setDescription(
        `Your message in **${guildName}** was removed due to inappropriate content.`
      )
      .addFields(
        { name: "Message Content", value: messageContent },
        { name: "Reason", value: reason || "No reason provided." },
        {
          name: "Warning",
          value: "Continued behavior can lead to further actions.",
        }
      )
      .setTimestamp();
    await user.send({ embeds: [dmEmbed] });
  } catch (err) {
    console.warn("⚠️ Could not DM the user.");
  }
}
