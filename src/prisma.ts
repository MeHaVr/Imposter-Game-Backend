import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { logger } from "./logger";

const url = process.env.DATABASE_URL;
if (!url || !url.trim()) {
  throw new Error("DATABASE_URL is not set (expected e.g. file:./dev.db)");
}

// Adapter erwartet { url }, nicht ein Database-Objekt
const adapter = new PrismaBetterSqlite3({ url });

export const prisma = new PrismaClient({ adapter });

// Optional: kleine Logs (hilft beim Debuggen)
logger.info(`Prisma initialized (SQLite via adapter), DATABASE_URL=${url}`);
