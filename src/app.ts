import express from "express";
import "dotenv/config";
import wordSetsRoute from "./routes/wordSets.routes";
import newWordSetsRoute from "./routes/NewWordSets.routes";
import { logger } from "./logger";

import "./bot/telegram";

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const app = express();

app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));
app.get("/", (_req, res) => res.send("Imposter Game Backend is running!"));

app.use("/word-sets", wordSetsRoute);
app.use("/new-word-set", newWordSetsRoute);

app.listen(PORT, () => {
  logger.info(`API running on http://localhost:${PORT}`);
});
