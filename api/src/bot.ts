import "dotenv/config";
import { Bot, session } from "grammy";
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

bot.command("newTemplate", templateHandler.handleTemplateCreating);
bot.callbackQuery(
  "template-from-past",
  templateHandler.handleTemplateAsPastWorkout,
);
bot.callbackQuery("template-manually");
bot.callbackQuery(/^template-from-workout:(\d+)$/, async (ctx) => {
  if (!ctx.match[1]) return;
  const workoutId = parseInt(ctx.match[1]);

  if (isNaN(workoutId)) {
    return ctx.answerCallbackQuery("Некоректний ID тренування");
  }

  await templateHandler.handleCopyWorkout(ctx, workoutId);
});

bot.command("find", statsHandler.handleFind);

bot.on("message:text", workoutHandler.handleMessage);

bot.catch((err) => {
  console.error("Error inside bot logic:", err);
});
