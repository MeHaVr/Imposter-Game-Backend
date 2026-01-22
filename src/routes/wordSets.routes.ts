import { Router } from "express";
import { prisma } from "../prisma";
import { logger } from "../logger";

const router = Router();

// GET /word-sets for list of word sets
router.get("/", async (_req, res) => {
  try {
    const wordSets = await prisma.wordSet.findMany({
      select: {
        id: true,
        title: true,
        desc: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    res.send(wordSets);
    logger.info("Fetched word sets successfully from: ", _req.ip);
    return;
  } catch (error) {
    logger.error("Error fetching word sets:", error);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
});

// GET /word-sets/:id for specific word set
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const wordSet = await prisma.wordSet.findUnique({
      where: { id: String(id) },
      select: {
        id: true,
        title: true,
        desc: true,
        words: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!wordSet) {
      res.status(404).json({ error: "WordSet not found" });
      return;
    }

    res.json(wordSet);
    logger.info("Fetched word set successfully from: ", req.ip);
    return;
  } catch (error) {
    logger.error("Error fetching word set:", error);
  }
});

router.post("/privat/redeem", async (req, res) => {
  const privatCode = String(req.body?.privatCode ?? "").trim();

  if (!/^\d{5}$/.test(privatCode)) {
    return res.status(400).json({ error: "Invalid privatCode" });
  }

  try {
    const set = await prisma.privatWordSet.findUnique({
      where: { privatCode },
    });

    if (!set) {
      return res.status(404).json({ error: "Code nicht gefunden" });
    }

    return res.json({
      ok: true,
      set: {
        id: set.id,
        title: set.title,
        desc: set.desc,
        words: set.words, // Json
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
