import { InlineKeyboard } from "grammy";
import type { MyContext } from "../types.js";
import workoutService from "../services/workout.service.js";
import { formatWorkoutSummary } from "../utils/utils.js";

const methodCreatingKeyboard = () =>
  new InlineKeyboard()
    .text("Manually", "tpl:manually")
    .text("From past workouts", "tpl:from_past")
    .row();

const editingTemplateKeyboard = () =>
  new InlineKeyboard()
    .text("Rename")
    .text("Add exercise")
    .text("Add set")
    .row()
    .text("Remove exercise")
    .text("Remove set")
    .row()
    .text("Save")
    .text("Discard")
    .row();

export const templateHandler = {
  async handleTemplateCreating(ctx: MyContext) {
    return ctx.reply("Choose a creating template option: ", {
      reply_markup: methodCreatingKeyboard(),
    });
  },

  async handleCallback(ctx: MyContext) {
    const data = ctx.callbackQuery?.data;
    if (!data) return;

    ctx.answerCallbackQuery();

    if (data === "tpl:manually") {
      return ctx.editMessageText("Template", {
        reply_markup: editingTemplateKeyboard(),
      });
    }

    if (data === "tpl:from_past") {
      const userId = ctx.from?.id;
      if (!userId) return;

      const lastWorkouts = await workoutService.findLastWorkouts(userId);
      if (!lastWorkouts) return ctx.reply("You don't have any workouts");

      const keyboard = new InlineKeyboard();

      lastWorkouts.forEach((w) => {
        const dataStr = w.startTime?.toLocaleDateString();
        keyboard.text(`Workout for ${dataStr}`, "tpl:create").row();
      });

      keyboard.text("Load more").text("Discard").row();

      return ctx.editMessageText("Choose a workout to create new template: ", {
        reply_markup: keyboard,
      });
    }
  },
};
