import { bot } from "./telegram";

bot.command("info", async (ctx) => {
  await ctx.send(
    `🤖 Bot läuft ✅\n` +
      `Chat-ID: ${ctx.chat.id}\n` +
      `User-ID: ${ctx.from?.id}`,
  );
});
