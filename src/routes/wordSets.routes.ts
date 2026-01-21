import { Router } from "express";
import { prisma } from "../prisma";

const router = Router();

// GET /word-sets for list of word sets
router.get("/", async (_req, res) => {
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

  res.json(wordSets);
});

// GET /word-sets/:id for specific word set
router.get("/:id", async (req, res) => {
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
});

export default router;
