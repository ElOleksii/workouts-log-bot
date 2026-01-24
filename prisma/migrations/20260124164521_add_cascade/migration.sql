-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_exercises" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "workout_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "exercises_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "workouts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_exercises" ("id", "name", "workout_id") SELECT "id", "name", "workout_id" FROM "exercises";
DROP TABLE "exercises";
ALTER TABLE "new_exercises" RENAME TO "exercises";
CREATE TABLE "new_sets" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "exercise_id" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    CONSTRAINT "sets_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_sets" ("exercise_id", "id", "reps", "weight") SELECT "exercise_id", "id", "reps", "weight" FROM "sets";
DROP TABLE "sets";
ALTER TABLE "new_sets" RENAME TO "sets";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
