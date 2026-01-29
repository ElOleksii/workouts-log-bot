import "dotenv/config";
import { Bot } from "grammy";

const url = process.argv[2];

if (!url) {
  console.error("Error: Provide the URL");
  console.log("Usage: npm run webhook <YOUR_VERCEL_URL>");
  process.exit(1);
}

const cleanUrl = url.replace(/\/+$/, "");
const fullUrl = `${cleanUrl}/api/index`;

const bot = new Bot(process.env.BOT_TOKEN!);

const setWebhook = async () => {
  console.log(`Trying to set webhook on ${fullUrl}`);
  try {
    const info = await bot.api.setWebhook(fullUrl);
    console.log("Webhook setted successfully");
    console.log("Telegram status: ", info);
  } catch (error) {
    console.error(error);
  }
};

setWebhook();
