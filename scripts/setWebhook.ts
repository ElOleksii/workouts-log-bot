import "dotenv/config";
import { Bot } from "grammy";

const bot = new Bot(process.env.BOT_TOKEN!);

(async () => {
  await bot.api.setWebhook("https://workouts-log-bot.vercel.app/api/webhook");
  console.log("Webhook set!");
})();
