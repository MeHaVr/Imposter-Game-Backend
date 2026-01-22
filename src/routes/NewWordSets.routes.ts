import { Router } from "express";
import { sendWordSetForReview, notifyTelegram } from "../bot/telegram";
import { v4 as uuidv4 } from "uuid";
import { Prisma } from "@prisma/client";
import { prisma } from "../prisma";
import { logger } from "../logger";

const router = Router();

router.post("/", async (req, res) => {
  logger.info("POST /word-sets/");

  const title = String(req.query.title ?? "");
  const desc = String(req.query.desc ?? "");
  const words = req.body?.words;
  const setId = uuidv4();

  if (
    title.length < 3 ||
    desc.length < 5 ||
    !Array.isArray(words) ||
    words.length === 0
  ) {
    logger.error("Invalid data", { title, desc, words });
    return res.status(400).json({
      error: "Invalid data",
      details:
        "Title (>=3), desc (>=5), words[], and 5-digit privatCode are required.",
    });
  }

  try {
    await prisma.pendingWordSet.create({
      data: {
        id: setId,
        title,
        desc,
        words: words as Prisma.JsonArray,
      },
    });
    logger.info("Created pending word set", { title, desc, words });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }

  await sendWordSetForReview({
    setId,
    title,
    desc,
    words,
    ip: req.ip,
  });

  return res.json({ ok: true, id: setId });
});

router.post("/privat/", async (req, res) => {
  logger.info("POST /word-sets/privat/");

  const title = String(req.query.title ?? "").trim();
  const desc = String(req.query.desc ?? "").trim();
  const words = req.body?.words;
  const privatCode = String(req.query.privatCode ?? "").trim();
  const setId = uuidv4();

  // -----------------------
  // Validation
  // -----------------------
  if (
    title.length < 3 ||
    desc.length < 5 ||
    !Array.isArray(words) ||
    words.length === 0 ||
    !/^\d{5}$/.test(privatCode)
  ) {
    logger.error("Invalid data", { title, desc, words, privatCode });
    return res.status(400).json({
      error: "Invalid data",
      details:
        "Title (>=3), desc (>=5), words[], and 5-digit privatCode are required.",
    });
  }

  try {
    const exists = await prisma.privatWordSet.findUnique({
      where: { privatCode },
    });

    if (exists) {
      logger.error("Code already exists", { privatCode });
      return res.status(409).json({
        error: "Code already exists",
      });
    }
  } catch (error) {
    logger.error("Error checking privatCode", error);
    return res.status(500).json({ error: "Database error" });
  }

  try {
    await prisma.privatWordSet.create({
      data: {
        id: setId,
        title,
        desc,
        words: words as Prisma.JsonArray,
        privatCode,
      },
    });
    logger.info("Created privat word set", { title, desc, words, privatCode });
  } catch (error) {
    logger.error("Error creating privat word set", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }

  // -----------------------
  // Telegram notify (INFO)
  // -----------------------
  try {
    await notifyTelegram(
      `🔐 *Privates Wörter-Set erstellt*\n\n` +
        `📌 Titel: ${title}\n` +
        `📝 Beschreibung: ${desc}\n` +
        `🔢 Privat-Code: ${privatCode}\n` +
        `📚 Wörter: ${words.length}\n` +
        `🆔 Set-ID: ${setId}\n` +
        `🌐 IP: ${req.ip}\n` +
        `⏰ Zeit: ${new Date().toLocaleString("de-CH")}`,
    );
  } catch (error) {
    // ❗ bewusst kein return → Set wurde ja erstellt
    logger.warn("Telegram notification failed", error);
  }

  // -----------------------
  // Response
  // -----------------------
  return res.json({
    ok: true,
    id: setId,
  });
});

export default router;
