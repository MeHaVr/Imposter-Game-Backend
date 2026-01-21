-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WordSet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL DEFAULT '',
    "words" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_WordSet" ("createdAt", "id", "title", "updatedAt", "words") SELECT "createdAt", "id", "title", "updatedAt", "words" FROM "WordSet";
DROP TABLE "WordSet";
ALTER TABLE "new_WordSet" RENAME TO "WordSet";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
