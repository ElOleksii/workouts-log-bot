import { calculateWorkoutTime } from "../queries.js";
import { statsService } from "../services/stats.service.js";
import type { MyContext } from "../types.js";
import { formatDuration, formatWorkoutSummary } from "../utils/utils.js";

export const statsHandler = {
  async handleFind(ctx: MyContext) {
    const userId = ctx.from?.id;
    if (!userId)
      return ctx.reply("User identification not found. Please try again.");

    const inputDate = typeof ctx.match === "string" ? ctx.match.trim() : "";

    try {
      const result = await statsService.getWorkoutsByDateInput(
        userId,
        inputDate,
      );

      if (!result) {
        if (inputDate) {
          return ctx.reply(
            "Invalid date format. Try: DD.MM.YYYY (e.g., 30 01)",
          );
        }
        return ctx.reply("No completed workouts found in history");
      }

      const { date, workouts } = result;

      if (workouts.length === 0) {
        const dateString = date.toLocaleDateString();
        return ctx.reply(`No workout sessions found for ${dateString}.`);
      }

      let responseMessage =
        workouts.length >= 2
          ? `**Workouts for ${date.toLocaleDateString()}:**\n\n`
          : `**Workout for ${date.toLocaleDateString()}:**\n`;

      for (const workout of workouts) {
        responseMessage += await formatWorkoutSummary(workout);
      }

      await ctx.reply(responseMessage, { parse_mode: "Markdown" });
    } catch (error) {
      console.error(error);
      await ctx.reply("");
    }
  },
};
