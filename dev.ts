import "dotenv/config";
import { bot } from "./src/bot.js";

console.log("Bot is working locally (Long Polling)...");
bot.start();
