import "dotenv/config";
import { prisma } from "../prisma";
import { logger } from "../logger";

async function main() {
  logger.info("🌱 Seeding database...");

  // Optional: reset damit nicht doppelt
  const deleted = await prisma.wordSet.deleteMany();
  logger.info(`Deleted ${deleted.count} existing WordSets`);

  const created = await prisma.wordSet.createMany({
    data: [
      {
        title: "Schule",
        desc: "Wörter rund um die Schule",
        words: [
          { word: "Banane", tips: ["gelb", "frucht", "krumm"] },
          { word: "Computer", tips: ["tastatur", "bildschirm", "technik"] },
        ],
      },
      {
        title: "Alltag",
        desc: "Wörter aus dem täglichen Leben",
        words: [
          { word: "Auto", tips: ["fahren", "strasse", "motor"] },
          { word: "Bett", tips: ["schlafen", "nacht", "müde"] },
        ],
      },
    ],
  });

  logger.info(`✅ Seeding finished. Inserted ${created.count} WordSets`);
}

main()
  .catch((e) => {
    logger.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    logger.info("Disconnected Prisma");
  });
