import { Bot } from "gramio";

export const bot = new Bot(process.env.BOT_TOKEN as string);

bot.command("start", (ctx) => ctx.send("Bot läuft ✅"));
bot.onStart(() => console.log("🤖 GramIO bot started"));

export async function notifyAdmin(text: string) {
  const adminId = process.env.TG_ADMIN_ID; // z.B. "12345678"
  if (!adminId) return;

  // GramIO: ctx.send braucht context – deswegen nutzen wir "api" call:
  // In GramIO kannst du i.d.R. bot.api nutzen (je nach version).
  // Falls das bei dir anders heisst, sag kurz deine GramIO Version.
  await bot.api.sendMessage({ chat_id: Number(adminId), text });
}
