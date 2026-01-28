import "dotenv/config";
import { bot } from "./src/bot";

console.log("Bot is working locally (Long Polling)...");
bot.start();
