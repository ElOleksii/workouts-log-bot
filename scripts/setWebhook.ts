import "dotenv/config";
import { Bot } from "grammy";

const bot = new Bot(process.env.BOT_TOKEN!);

(async () => {
  const url = process.env.WEBHOOK_URL!;
  await bot.api.setWebhook(url);
  console.log("Webhook set to:", url);
})();
