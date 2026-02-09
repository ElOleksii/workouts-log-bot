import "dotenv/config";
import { Bot, GrammyError, HttpError, session } from "grammy";
import { Redis } from "ioredis";
import { RedisAdapter } from "@grammyjs/storage-redis";
import type { MyContext, SessionData } from "./types.js";
import { workoutHandler } from "./handlers/workout.handler.js";
import { statsHandler } from "./handlers/stats.handler.js";
import { templateHandler } from "./handlers/template.handler.js";

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not defined in environment variables");
}

const redisInstance = new Redis(process.env.REDIS_URL);

export const bot = new Bot<MyContext>(process.env.BOT_TOKEN!);
const initial = (): SessionData => {
  return {
    activeWorkoutId: null,
    currentExerciseId: null,
    templateDraft: null,
    templateStage: "idle",
    templateCurrentExerciseIdx: null,
  };
};

bot.use(
  session({
    initial,
    storage: new RedisAdapter({ instance: redisInstance, ttl: 3600 * 4 }),
  }),
);

bot.command("start", async (ctx) => {
  await ctx.reply(
    "Welcome to the Workout Logging System. This service helps you track and manage your training sessions.\n\n" +
      "Available Commands:\n" +
      "/new - Start a new workout session\n" +
      "/finish - Complete the current workout session\n" +
      "/cancel - Cancel the current workout session\n" +
      "/undo - Remove the last set or exercise if empty\n" +
      "/find - Retrieve workouts by date (format: DD.MM.YYYY, DD MM YYYY, or DD.MM.YY)\n\n" +
      "Usage Instructions:\n" +
      "1. Enter the exercise name (e.g., 'Pull-ups')\n" +
      "2. Enter the weight and repetitions (e.g., '80, 12')\n" +
      "3. Continue with additional exercises as needed\n",
  );
});

bot.command("new", workoutHandler.handleNew);
bot.command("finish", workoutHandler.handleFinish);
bot.command("cancel", workoutHandler.handleCancel);
bot.command("undo", workoutHandler.handleUndo);

bot.command("new_template", templateHandler.handleTemplateCreating);
bot.on("callback_query", templateHandler.handleCallback);

bot.command("find", statsHandler.handleFind);

bot.on("message:text", async (ctx) => {
  const handled = await templateHandler.handleMessage(ctx);
  if (handled) return;
  await workoutHandler.handleMessage(ctx);
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;

  if (e instanceof GrammyError) {
    if (e.description.includes("query is too old")) {
      console.warn("Ignoring old callback query (time expired).");
      return;
    }
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});
