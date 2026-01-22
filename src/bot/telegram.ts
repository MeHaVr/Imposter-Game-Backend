// src/bot/telegram.ts
import { Bot } from "gramio";
import { logger } from "../logger";
import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";

export const ADMIN_CHAT_ID = process.env.TG_ADMIN_ID!;
const BOT_TOKEN = process.env.TG_BOT_TOKEN!;

if (!BOT_TOKEN) throw new Error("TG_BOT_TOKEN fehlt in .env");
if (!ADMIN_CHAT_ID) throw new Error("TG_ADMIN_ID fehlt in .env");

export const bot = new Bot(BOT_TOKEN);

// /start => zeigt IDs (hilft beim Setup)
bot.command("start", async (ctx) => {
  await ctx.send(
    `🤖 Bot läuft ✅\nChat-ID: ${ctx.chat.id}\nUser-ID: ${ctx.from?.id}`,
  );
});

type ReviewWord = { word: string; tips: string[] };

export async function sendWordSetForReview(params: {
  setId: string;
  title: string;
  desc: string;
  words: ReviewWord[];
  ip?: string;
}) {
  const { setId, title, desc, words, ip } = params;

  const MAX_LIST = 25;
  const list = words
    .slice(0, MAX_LIST)
    .map((w) => `• ${w.word} (Tipps: ${w.tips?.join(", ") || "—"})`)
    .join("\n");

  const more =
    words.length > MAX_LIST ? `\n\n(+${words.length - MAX_LIST} weitere…)` : "";

  const text =
    `🆕 Neues Wörter-Set hochgeladen\n\n` +
    `📌 Titel: ${title}\n` +
    `📝 Beschreibung: ${desc}\n` +
    `📚 Wörter: ${words.length}\n` +
    (ip ? `🌐 IP: ${ip}\n` : "") +
    `⏱️ Time: ${new Date().toISOString()}\n\n` +
    `Wörter im Set:\n${list}${more}`;

  await bot.api.sendMessage({
    chat_id: Number(ADMIN_CHAT_ID),
    text,
    reply_markup: {
      inline_keyboard: [
        [
          { text: "✅ Akzeptieren", callback_data: `approve:${setId}` },
          { text: "❌ Ablehnen", callback_data: `reject:${setId}` },
          { text: "🔍 Mehr Anzeigen", callback_data: `show-more:${setId}` },
        ],
      ],
    },
  });

  // await bot.api.
}

bot.on("callback_query", async (ctx) => {
  // ✅ FIX: in deiner GramIO version ist callback_data meistens hier:
  const body = (ctx as any).query?.data ?? (ctx as any).queryPayload;
  if (!body) {
    logger.warn("callback_query without data", {
      keys: Object.keys(ctx as any),
    });
    return;
  }

  const raw = body.toString();
  if (!raw.includes(":")) {
    logger.warn("callback_data has no ':'", { raw });
    // optional: user feedback
    try {
      await ctx.answerCallbackQuery({
        text: "⚠️ Ungültiger Button",
        show_alert: true,
      });
    } catch (e) {
      logger.warn("answerCallbackQuery failed", e as any);
    }
    return;
  }

  const [command, setId] = raw.split(":");
  if (!command || !setId) {
    logger.warn("callback_data missing parts", { raw, command, setId });
    try {
      await ctx.answerCallbackQuery({
        text: "⚠️ Ungültige Daten",
        show_alert: true,
      });
    } catch (e) {
      logger.warn("answerCallbackQuery failed", e as any);
    }
    return;
  }

  // optional: ack click so Telegram UI doesn't "load"
  try {
    await ctx.answerCallbackQuery({
      text: "⏳ Wird verarbeitet...",
      show_alert: false,
    });
  } catch (e) {
    logger.warn("answerCallbackQuery failed", e as any);
  }

  switch (command) {
    case "approve":
      logger.log("approve", { setId });

      try {
        const set = await prisma.pendingWordSet.findUnique({
          where: { id: setId },
        });

        if (!set) {
          await notifyTelegram("Pending set not found");
          logger.warn("Pending set not found", { setId });

          try {
            await ctx.editText(`  Pending Set nicht gefunden.\nID: ${setId}`);
          } catch (e) {
            logger.warn("editText failed", e as any);
          }
          break;
        }

        const already = await prisma.wordSet.findUnique({
          where: { id: setId },
        });

        if (already) {
          await notifyTelegram("Set already exists in WordSet");
          logger.warn("Set already exists in WordSet", { setId });

          try {
            await ctx.editText(
              `ℹ️ Dieses Set ist bereits übernommen.\nID: ${setId}`,
            );
          } catch (e) {
            logger.warn("editText failed", e as any);
          }
          break;
        }

        await prisma.wordSet.create({
          data: {
            title: set.title,
            desc: set.desc,
            words: set.words as Prisma.JsonArray,
            id: setId,
          },
        });

        await prisma.pendingWordSet.delete({ where: { id: setId } });

        try {
          await ctx.editText(`✅ Set akzeptiert und übernommen.\nID: ${setId}`);
        } catch (e) {
          logger.warn("editText failed", e as any);
        }
      } catch (error) {
        await notifyTelegram("Error while accepting set");
        logger.error("Error while accepting set", error as any);

        try {
          await ctx.editText(`❌ Fehler beim Akzeptieren.\nID: ${setId}`);
        } catch (e) {
          logger.warn("editText failed", e as any);
        }
      }

      break;

    case "reject":
      logger.log("reject", { setId });

      try {
        const exists = await prisma.pendingWordSet.findUnique({
          where: { id: setId },
        });
        if (!exists) {
          await notifyTelegram("Pending set not found (reject)");
          logger.warn("Pending set not found (reject)", { setId });

          try {
            await ctx.editText(`Pending Set nicht gefunden.\nID: ${setId}`);
          } catch (e) {
            logger.warn("editText failed", e as any);
          }
          break;
        }

        await prisma.pendingWordSet.delete({ where: { id: setId } });

        try {
          await ctx.editText(`Set abgelehnt und gelöscht.\nID: ${setId}`);
        } catch (e) {
          logger.warn("editText failed", e as any);
        }
      } catch (error) {
        await notifyTelegram("Error while rejecting set");
        logger.error("Error while rejecting set", error as any);

        try {
          await ctx.editText(`Fehler beim Ablehnen.\nID: ${setId}`);
        } catch (e) {
          logger.warn("editText failed", e as any);
        }
      }

      break;

    case "show-more":
      logger.log("show-more", { setId });

      try {
        const data = await prisma.pendingWordSet.findUnique({
          where: { id: setId },
        });

        if (!data) {
          await ctx.answerCallbackQuery({
            text: "Pending Set nicht gefunden.",
            show_alert: true,
          });
          return;
        }

        const allwords = (data.words as Prisma.JsonArray)
          .map((w: any) => `• ${w.word} (Tipps: ${w.tips?.join(", ") || "—"})`)
          .join("\n");

        await ctx.answerCallbackQuery({
          text: "📩 Wörter werden als Nachricht gesendet…",
          show_alert: false,
        });

        const full = `Wörter im Set:\n${allwords}`;

        const chunks: string[] = [];
        for (let i = 0; i < full.length; i += 4000) {
          chunks.push(full.slice(i, i + 4000));
        }

        for (const chunk of chunks) {
          await ctx.send(chunk);
        }
      } catch (error) {
        logger.error("show-more failed", error as any);
        await ctx.answerCallbackQuery({
          text: "❌ Fehler beim Laden der Wörter.",
          show_alert: true,
        });
      }

      break;

    default:
      logger.warn("Unknown command", { raw, command, setId });
      try {
        await ctx.answerCallbackQuery({
          text: "Unbekannter Button",
          show_alert: true,
        });
      } catch (e) {
        logger.warn("answerCallbackQuery failed", e as any);
      }
  }

  logger.info(raw);
});

bot.onStart(() => logger.info("Telegram Bot gestartet"));
bot.start();

export async function notifyTelegram(message: string) {
  try {
    await bot.api.sendMessage({
      chat_id: Number(ADMIN_CHAT_ID),
      text: message,
    });
  } catch (err) {
    logger.error("Telegram notify failed", err);
  }
}
