import { InlineKeyboard } from "grammy";
import { statsService } from "../services/stats.service.js";
import type { MyContext } from "../types.js";
import { formatWorkoutSummary } from "../utils/utils.js";
import workoutService from "../services/workout.service.js";

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
      await ctx.reply("Error while loading.");
    }
  },
  async handleGetWorkouts(ctx: MyContext) {
    const userId = ctx.from?.id;
    if (!userId) return;

    const { workouts, nextCursor } = await statsService.findAllWorkouts(
      userId,
      5,
    );

    const keyboard = new InlineKeyboard();

    workouts.forEach((w) => {
      const dataStr = w.startTime?.toLocaleDateString();
      keyboard
        .text(`Workout for ${dataStr}`, `stats:get_workout:${w.id}`)
        .row();
    });

    if (nextCursor) {
      keyboard.text("Load more", `stats:load_more:${nextCursor}`).row();
    }

    return ctx.reply("Choose a workout to get.", { reply_markup: keyboard });
  },

  async handleCallback(ctx: MyContext) {
    const data = ctx.callbackQuery?.data;
    if (!data) return;

    ctx.answerCallbackQuery();

    if (data.startsWith("stats:load_more")) {
      const userId = ctx.from?.id;
      if (!userId) return;
      const cursor = Number(data.split(":")[2]);

      const { workouts, nextCursor } = await statsService.findAllWorkouts(
        userId,
        5,
        cursor,
      );

      const keyboard = new InlineKeyboard();

      workouts.forEach((w) => {
        const dataStr = w.startTime?.toLocaleDateString();
        keyboard
          .text(`Workout for ${dataStr}`, `stats:get_workout:${w.id}`)
          .row();
      });

      if (nextCursor) {
        keyboard.text("Load more", `stats:load_more:${nextCursor}`).row();
      }

      return ctx.reply("Choose a workout to get.", { reply_markup: keyboard });
    }

    if (data.startsWith("stats:get_workout:")) {
      const workoutId = Number(data.split(":")[2]);
      if (!workoutId) return ctx.reply("Couldn't be able to load the workout.");

      const workout = await workoutService.getWorkoutById(workoutId);

      const responseMessage = await formatWorkoutSummary(workout);

      return await ctx.reply(responseMessage, { parse_mode: "Markdown" });
    }
  },
};
