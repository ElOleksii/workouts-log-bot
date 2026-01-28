import "dotenv/config";
import { bot } from "./_lib/bot";

console.log("Bot is working locally (Long Polling)...");
bot.start();
