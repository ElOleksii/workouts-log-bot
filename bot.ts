import "dotenv/config";
import { Bot, Context, Keyboard, session, type SessionFlavor } from "grammy";
import Database from "better-sqlite3";

const db = new Database("log.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    start_time TEXT,
    end_time TEXT,
    is_finished INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    `);

db.exec(`CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workout_id INTEGER,
    name TEXT NOT NULL,
    FOREIGN KEY(workout_id) REFERENCES workouts(id)
    );`);

db.exec(`
    CREATE TABLE IF NOT EXISTS sets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exercise_id INTEGER NOT NULL,
    reps INTEGER NOT NULL,
    weight NUMERIC NOT NULL,
    FOREIGN KEY(exercise_id) REFERENCES exercises(id)
    );`);

interface SessionData {
  activeWorkoutId: number | null;
  currentExerciseId: number | null;
}

type MyContext = Context & SessionFlavor<SessionData>;

const bot = new Bot<MyContext>(process.env.BOT_TOKEN!);
const initial = (): SessionData => {
  return {
    activeWorkoutId: null,
    currentExerciseId: null,
  };
};
bot.use(session({ initial }));

await bot.api.setMyCommands([
  { command: "new", description: "Start new workout" },
  { command: "finish", description: "Finish current workout" },
  { command: "cancel", description: "Cancel current workout" },
  { command: "find", description: "Find a workout(s) by date" },
  // { command: "persona", description: "Select a bot persona" },
]);

bot.command("start", async (ctx) => {
  await ctx.reply(
    "Hi, Sir! I'm your personal Gym Assistant and I'm here to log your workout\n\n." +
      "Commands\n" +
      "/new - Start new workout\n" +
      "/finish - Finish current workout\n" +
      "/cancel - Cancel current workout\n\n" +
      "How it works:\n" +
      "1. Write a name of the exercise ('Pull-ups', for example)" +
      "2. Write current weight and reps the set ('80, 12', for exmaple)" +
      "3. Repeat for new exercises",
  );
});

bot.command("new", async (ctx) => {
  if (ctx.session.activeWorkoutId) {
    return ctx.reply(
      "Sir, you are training now. Finish current workout first.",
    );
  }

  const userId = ctx.from?.id;
  const date = new Date().toISOString();

  const record = db.prepare(
    `INSERT INTO workouts(user_id, start_time, created_at ) VALUES(?, ?, ?)`,
  );
  const info = record.run(userId, date, date);

  ctx.session.activeWorkoutId = Number(info.lastInsertRowid);

  await ctx.reply(
    'Sir, workout has started, good luck! Write a name of the first exercise ("Pull-ups", for example)',
  );
});

bot.command("finish", async (ctx) => {
  if (!ctx.session.activeWorkoutId) {
    return ctx.reply(
      "Sir, you are not training right now. Start a workout first.",
    );
  }

  const currentWorkout = ctx.session.activeWorkoutId;
  const date = new Date().toISOString();

  db.prepare(
    `UPDATE workouts SET is_finished = 1, end_time = ? WHERE id = ?`,
  ).run(date, currentWorkout);

  ctx.session.activeWorkoutId = null;
  ctx.session.currentExerciseId = null;

  await ctx.reply("Great job, sir. Your workout has been recorded.");
});

bot.command("cancel", async (ctx) => {
  if (!ctx.session.activeWorkoutId) {
    return ctx.reply(
      "Sir, you are not training right now. Start a workout first.",
    );
  }

  const currentWorkout = ctx.session.activeWorkoutId;

  db.prepare(`DELETE FROM workouts WHERE id = ?`).run(currentWorkout);

  ctx.session.activeWorkoutId = null;
  ctx.session.currentExerciseId = null;

  await ctx.reply("Sir, your current workout has canceled. Take care.");
});

bot.on("message:text", async (ctx) => {
  const text = ctx.message.text.trim();

  if (!ctx.session.activeWorkoutId) {
    return ctx.reply("Sir, you must start a new training first using /new.");
  }

  const setRegex = /^(\d+(?:\.\d+)?)[,\s]+(\d+)$/;
  const match = text.match(setRegex);

  if (match && match[1] && match[2]) {
    if (!ctx.session.currentExerciseId) {
      return ctx.reply("Sir, you must write name of the exercise.");
    }

    const currentExercise = ctx.session.currentExerciseId;
    const weight = parseFloat(match[1]);
    const reps = parseInt(match[2]);

    db.prepare(
      `INSERT INTO sets (exercise_id, reps, weight) VALUES (?, ?, ?)`,
    ).run(currentExercise, weight, reps);

    await ctx.reply("Understood, Sir, the set is has been recorded.");
  } else {
    const activeWorkout = ctx.session.activeWorkoutId;

    const record = db.prepare(
      `INSERT INTO exercises (workout_id, name) VALUES (?, ?)`,
    );
    const info = record.run(activeWorkout, text);

    ctx.session.currentExerciseId = Number(info.lastInsertRowid);

    await ctx.reply(
      `Sir, the your current exercise ${text}\nNext step - provide weight and reps (50, 5 - for example). `,
    );
  }
});

bot.start();
