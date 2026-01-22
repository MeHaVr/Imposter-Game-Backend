import "dotenv/config";
import { prisma } from "../prisma";
import { logger } from "../logger";

async function main() {
  logger.info("🌱 Seeding database...");

  // =======================
  // RESET DATABASE
  // =======================
  const delPrivat = await prisma.privatWordSet.deleteMany();
  logger.info(`Deleted ${delPrivat.count} PrivatWordSets`);

  const delPending = await prisma.pendingWordSet.deleteMany();
  logger.info(`Deleted ${delPending.count} PendingWordSets`);

  const delWordSets = await prisma.wordSet.deleteMany();
  logger.info(`Deleted ${delWordSets.count} WordSets`);

  // =======================
  // WORD SETS
  // =======================
  const wordSets = [
    {
      title: "Schule",
      desc: "Wörter rund um die Schule",
      words: [
        { word: "Lehrer", tips: ["unterricht", "klasse", "erklären"] },
        { word: "Tafel", tips: ["anschreiben", "kreide", "vorne"] },
        { word: "Prüfung", tips: ["lernen", "stress", "note"] },
        { word: "Pause", tips: ["hof", "essen", "erholen"] },
        { word: "Heft", tips: ["notizen", "papier", "schreiben"] },
      ],
    },
    {
      title: "Alltag",
      desc: "Wörter aus dem täglichen Leben",
      words: [
        { word: "Handy", tips: ["apps", "telefon", "bildschirm"] },
        { word: "Bett", tips: ["schlafen", "nacht", "müde"] },
        { word: "Dusche", tips: ["wasser", "warm", "bad"] },
        { word: "Einkaufen", tips: ["laden", "geld", "produkte"] },
        { word: "Kochen", tips: ["pfanne", "herd", "essen"] },
      ],
    },
    {
      title: "Essen",
      desc: "Alles rund ums Essen",
      words: [
        { word: "Pizza", tips: ["käse", "ofen", "italien"] },
        { word: "Apfel", tips: ["frucht", "rot", "baum"] },
        { word: "Pasta", tips: ["nudeln", "kochen", "italien"] },
        { word: "Brot", tips: ["backen", "mehl", "kruste"] },
        { word: "Käse", tips: ["milch", "reif", "würzig"] },
      ],
    },
    {
      title: "Tiere",
      desc: "Verschiedene Tiere",
      words: [
        { word: "Hund", tips: ["bellen", "haustier", "treu"] },
        { word: "Katze", tips: ["miauen", "fell", "schlafen"] },
        { word: "Pferd", tips: ["reiten", "stall", "schnell"] },
        { word: "Vogel", tips: ["fliegen", "federn", "singen"] },
        { word: "Fisch", tips: ["wasser", "flossen", "teich"] },
      ],
    },
    {
      title: "Technik",
      desc: "Technische Begriffe",
      words: [
        { word: "Computer", tips: ["rechner", "technik", "arbeit"] },
        { word: "Internet", tips: ["online", "daten", "seiten"] },
        { word: "Maus", tips: ["klicken", "usb", "hand"] },
        { word: "Tastatur", tips: ["tippen", "tasten", "buchstaben"] },
        { word: "Update", tips: ["neu", "version", "installieren"] },
      ],
    },
    {
      title: "Freizeit",
      desc: "Aktivitäten in der Freizeit",
      words: [
        { word: "Gaming", tips: ["zocken", "konsole", "spaß"] },
        { word: "Lesen", tips: ["buch", "ruhe", "seiten"] },
        { word: "Musik", tips: ["hören", "lied", "rhythmus"] },
        { word: "Zeichnen", tips: ["stift", "papier", "bild"] },
        { word: "Treffen", tips: ["freunde", "reden", "lachen"] },
      ],
    },
    {
      title: "Sport",
      desc: "Sportarten",
      words: [
        { word: "Fussball", tips: ["ball", "team", "tor"] },
        { word: "Basketball", tips: ["korb", "dribbeln", "team"] },
        { word: "Joggen", tips: ["laufen", "tempo", "schuhe"] },
        { word: "Schwimmen", tips: ["wasser", "becken", "bad"] },
        { word: "Fitness", tips: ["training", "kraft", "studio"] },
      ],
    },
    {
      title: "Natur",
      desc: "Dinge aus der Natur",
      words: [
        { word: "Baum", tips: ["holz", "blätter", "wald"] },
        { word: "Berg", tips: ["hoch", "gipfel", "wandern"] },
        { word: "See", tips: ["wasser", "ruhe", "ufer"] },
        { word: "Blume", tips: ["duft", "farbe", "wiese"] },
        { word: "Sonne", tips: ["warm", "licht", "tag"] },
      ],
    },
    {
      title: "IT",
      desc: "Begriffe aus der Informatik",
      words: [
        { word: "Code", tips: ["programmieren", "logik", "syntax"] },
        { word: "Server", tips: ["backend", "daten", "online"] },
        { word: "Frontend", tips: ["ui", "browser", "design"] },
        { word: "Backend", tips: ["api", "datenbank", "logik"] },
        { word: "Bug", tips: ["fehler", "fix", "problem"] },
      ],
    },
  ];

  for (const set of wordSets) {
    await prisma.wordSet.create({ data: set });
  }

  logger.info(`✅ Inserted ${wordSets.length} WordSets`);

  // =======================
  // PRIVAT WORD SETS (FIXE CODES)
  // =======================
  const privatSets = [
    {
      title: "Privat Demo 1",
      desc: "Privates Test-Set mit Code 12345",
      privatCode: "12345",
      words: [
        { word: "Swisscom", tips: ["telekom", "blau", "arbeit"] },
        { word: "Bern", tips: ["stadt", "schweiz", "hauptstadt"] },
        { word: "React", tips: ["frontend", "ui", "components"] },
      ],
    },
    {
      title: "Privat Demo 2",
      desc: "Privates Test-Set mit Code 00000",
      privatCode: "00000",
      words: [
        { word: "Prisma", tips: ["orm", "db", "typescript"] },
        { word: "Telegram", tips: ["bot", "notify", "buttons"] },
        { word: "Imposter", tips: ["game", "fake", "spieler"] },
      ],
    },
  ];

  for (const set of privatSets) {
    await prisma.privatWordSet.create({ data: set });
    logger.info(`🔐 Inserted PrivatWordSet (code=${set.privatCode})`);
  }

  // =======================
  // FINISH
  // =======================
  logger.info("🌱 Seeding finished successfully.");
}

main()
  .catch((e) => {
    logger.error("❌ Seeding error", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    logger.info("Disconnected Prisma");
  });
