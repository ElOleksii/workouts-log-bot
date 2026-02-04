import { InlineKeyboard } from "grammy";
import type { MyContext } from "../types.js";
import workoutService from "../services/workout.service.js";
import { formatWorkoutSummary } from "../utils/utils.js";

export const templateHandler = {
  async handleTemplateCreating(ctx: MyContext) {
    const keyboard = new InlineKeyboard()
      .text("From the past workout", "template-from-past")
      .text("Manually", "template-manually");

    await ctx.reply("Choose how you want to create new template?", {
      reply_markup: keyboard,
    });
  },

  async handleTemplateAsPastWorkout(ctx: MyContext) {
    await ctx.answerCallbackQuery();
    const userId = ctx.from?.id;
    if (!userId) return;

    const workouts = await workoutService.findLastWorkouts(userId);

    if (!workouts || workouts.length <= 0) {
      await ctx.reply("You don't have any workouts yet.");
    }

    const keyboard = new InlineKeyboard();

    workouts.forEach((w) => {
      const date = w.startTime?.toLocaleDateString();
      keyboard
        .text(`Workout for ${date}`, `template-from-workout:${w.id}`)
        .row();
    });

    await ctx.reply("Choose workout to create new template:", {
      reply_markup: keyboard,
    });
  },
  async handleCopyWorkout(ctx: MyContext, workoutId: number) {
    const workout = await workoutService.getWorkoutById(workoutId);

    if (!workout) return ctx.answerCallbackQuery("Workout hasn't founded");

    const dateStr = workout.startTime
      ? new Date(workout.startTime).toLocaleDateString()
      : "Unknown data";

    const defaultName = `Template for ${dateStr}\n\n`;

    await ctx.reply(defaultName + (await formatWorkoutSummary(workout)));
  },
};
