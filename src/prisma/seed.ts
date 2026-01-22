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
        title: "Wetter",
        desc: "Verschiedene Wetterarten",
        words: [
          { word: "Regen", tips: ["nass", "wolken", "schirm"] },
          { word: "Schnee", tips: ["kalt", "weiss", "winter"] },
          { word: "Wind", tips: ["stark", "luft", "draussen"] },
          { word: "Nebel", tips: ["sicht", "grau", "morgen"] },
          { word: "Sonne", tips: ["warm", "hell", "sommer"] },
        ],
      },
      {
        title: "Verkehr",
        desc: "Fortbewegung",
        words: [
          { word: "Auto", tips: ["fahren", "motor", "strasse"] },
          { word: "Bus", tips: ["linie", "haltestelle", "fahren"] },
          { word: "Zug", tips: ["gleis", "bahnhof", "reisen"] },
          { word: "Fahrrad", tips: ["treten", "helm", "rad"] },
          { word: "Tram", tips: ["schienen", "stadt", "fahren"] },
        ],
      },
      {
        title: "Haushalt",
        desc: "Dinge im Haushalt",
        words: [
          { word: "Staubsauger", tips: ["putzen", "boden", "lärm"] },
          { word: "Waschmaschine", tips: ["wäsche", "trommel", "wasser"] },
          { word: "Kühlschrank", tips: ["kalt", "essen", "lager"] },
          { word: "Ofen", tips: ["backen", "hitze", "küche"] },
          { word: "Lampe", tips: ["licht", "schalter", "raum"] },
        ],
      },
      {
        title: "Gefühle",
        desc: "Emotionen",
        words: [
          { word: "Freude", tips: ["lachen", "glücklich", "positiv"] },
          { word: "Angst", tips: ["sorge", "zittern", "furcht"] },
          { word: "Wut", tips: ["laut", "ärger", "heftig"] },
          { word: "Trauer", tips: ["weinen", "leise", "traurig"] },
          { word: "Liebe", tips: ["herz", "nähe", "gefühle"] },
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
      {
        title: "Zeit",
        desc: "Alles rund um Zeit",
        words: [
          { word: "Minute", tips: ["kurz", "uhr", "sekunden"] },
          { word: "Stunde", tips: ["60", "zeit", "dauer"] },
          { word: "Tag", tips: ["morgen", "heute", "nacht"] },
          { word: "Woche", tips: ["tage", "kalender", "arbeit"] },
          { word: "Jahr", tips: ["monate", "zeit", "kalender"] },
        ],
      },
      {
        title: "Ferien",
        desc: "Urlaub & Erholung",
        words: [
          { word: "Strand", tips: ["sand", "meer", "sonne"] },
          { word: "Hotel", tips: ["zimmer", "schlafen", "ferien"] },
          { word: "Flugzeug", tips: ["fliegen", "urlaub", "airport"] },
          { word: "Camping", tips: ["zelt", "natur", "draussen"] },
          { word: "Reisen", tips: ["koffer", "weg", "entdecken"] },
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
