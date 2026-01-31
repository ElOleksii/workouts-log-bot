import { calculateWorkoutTime } from "../queries.js";
import { statsService } from "../services/stats.service.js";
import type { MyContext } from "../types.js";
import { formatDuration } from "../utils/utils.js";

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
        const startTime = workout.startTime
          ? new Date(workout.startTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Unknown";
        const endTime = workout.endTime
          ? new Date(workout.endTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "...";

        responseMessage += `**Workout at ${startTime} - ${endTime}**\n`;

        if (workout.exercises.length === 0) {
          responseMessage += `_No exercises recorded._\n`;
        }

        workout.exercises.forEach((exercise, index) => {
          responseMessage += `\n${index + 1}. **${exercise.name}**\n`;

          if (exercise.sets.length > 0) {
            exercise.sets.forEach((set, setIndex) => {
              responseMessage += `   - Set ${setIndex + 1}: ${set.weight}kg × ${
                set.reps
              }\n`;
            });
          } else {
            responseMessage += `   (No sets recorded)\n`;
          }
        });

        const duration = await calculateWorkoutTime(workout.id);

        if (duration) {
          responseMessage += `\nSession duration: ${formatDuration(duration)}\n\n`;
        }
      }

      await ctx.reply(responseMessage, { parse_mode: "Markdown" });
    } catch (error) {
      console.error(error);
      await ctx.reply("");
    }
  },
};
