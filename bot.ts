import "dotenv/config";
import { Bot } from "grammy";

const bot = new Bot(process.env.BOT_TOKEN!);

bot.command("start", async (ctx) => {
  await ctx.reply(
    "👋 Hi! I'm GymLog Bot.\n\n" +
      "📝 **How to use:**\n" +
      "1. Send me description of your workout to save it.\n" +
      "2. Send date in format `YYYY-MM-DD`, to see how you've trained in this day"
  );
});

bot.command("addWorkout", (ctx) => {
  ctx.reply("You've started a workout");
});

bot.on("message", (ctx) => {
  ctx.reply(`You said: ${ctx.message.text}`);
});

bot.start();
