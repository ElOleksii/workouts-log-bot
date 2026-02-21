import "dotenv/config";
import { Bot } from "grammy";

const bot = new Bot(process.env.BOT_TOKEN!);

const commands = [
  { command: "new", description: "Start new workout" },
  { command: "finish", description: "Finish current workout" },
  { command: "cancel", description: "Cancel current workout" },
  { command: "find", description: "Find a workout(s) by date" },
  { command: "undo", description: "Remove last set or exercise" },
  {
    command: "new_template",
    description: "Add template to use for repeating workouts",
  },
  {
    command: "manage_templates",
    description: "Allows to edit your templates.",
  },
  {
    command: "/get_workouts",
    description: "Display list of your workouts to get info.",
  },
];

const setCommands = async () => {
  try {
    await bot.api.setMyCommands(commands);
    console.log("Commands setted successfully");
  } catch (error) {
    console.error("Error: ", error);
  }
};

setCommands();
