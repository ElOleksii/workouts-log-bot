// scripts/setCommands.ts
import { Bot } from "grammy";
import "dotenv/config";

const bot = new Bot(process.env.BOT_TOKEN!);

await bot.api.setMyCommands([
  { command: "new", description: "Start new workout" },
  { command: "finish", description: "Finish current workout" },
  { command: "cancel", description: "Cancel current workout" },
  { command: "find", description: "Find a workout(s) by date" },
]);

console.log("Commands set");
