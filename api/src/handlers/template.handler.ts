import { InlineKeyboard } from "grammy";
import type { MyContext, TemplateDraft } from "../types.js";
import workoutService from "../services/workout.service.js";
import { formatWorkoutSummary } from "../utils/utils.js";

const methodCreatingKeyboard = () =>
  new InlineKeyboard()
    .text("Manually", "tpl:manually")
    .text("From past workouts", "tpl:from_past")
    .row();

const editingTemplateKeyboard = () =>
  new InlineKeyboard()
    .text("Rename", "tpl:rename")
    .text("Add exercise", "tpl:add_ex")
    .text("Add set", "tpl:add_set")
    .row()
    .text("Remove exercise", "tpl:remove_ex")
    .text("Remove set", "tpl:remove_set")
    .row()
    .text("Save", "tpl:save")
    .text("Discard", "tpl:discard")
    .row();

const backKeyboard = () => new InlineKeyboard().text("Back", "tpl:back");

const resetTemplateDraft = (ctx: MyContext) => {
  ctx.session.templateDraft = null;
  ctx.session.templateStage = "idle";
  ctx.session.templateCurrentExerciseIdx = null;
};

const ensureTemplateDraft = (ctx: MyContext): TemplateDraft => {
  if (!ctx.session.templateDraft) {
    ctx.session.templateDraft = {
      name: "New template",
      exercises: [],
    };
  }
  return ctx.session.templateDraft;
};

const formatTemplate = (draft: TemplateDraft): string => {
  let output = `Template ${draft.name || "Unnamed"}`;
  if (draft.exercises.length === 0) {
    output += "\nNo exercises yet.";
    return output;
  }

  draft.exercises.forEach((exercise, idx) => {
    output += `\n${idx + 1}. ${exercise.name}\n`;
    if (exercise.sets.length === 0) {
      output += "       (no sets).\n";
    }
    exercise.sets.forEach((set, setIdx) => {
      output += `   - Set ${setIdx + 1}: ${set.weight} x ${set.reps}\n`;
    });
  });
  return output.trimEnd();
};

export const templateHandler = {
  async handleTemplateCreating(ctx: MyContext) {
    resetTemplateDraft(ctx);
    return ctx.reply("Choose how to create a template: ", {
      reply_markup: methodCreatingKeyboard(),
    });
  },

  async handleCallback(ctx: MyContext) {
    const data = ctx.callbackQuery?.data;
    if (!data) return;

    ctx.answerCallbackQuery();

    if (data === "tpl:manually") {
      const currentTemplate = ensureTemplateDraft(ctx);
      ctx.session.templateStage = "idle";
      return ctx.editMessageText(formatTemplate(currentTemplate), {
        reply_markup: editingTemplateKeyboard(),
      });
    }

    if (data === "tpl:from_past") {
      const userId = ctx.from?.id;
      if (!userId) return;

      const lastWorkouts = await workoutService.findLastWorkouts(userId);
      if (!lastWorkouts || lastWorkouts.length === 0)
        return ctx.editMessageText("You don't have any past workouts", {
          reply_markup: methodCreatingKeyboard(),
        });

      const keyboard = new InlineKeyboard();

      lastWorkouts.forEach((w) => {
        const dataStr = w.startTime?.toLocaleDateString();
        keyboard
          .text(`Workout for ${dataStr}`, `tpl:create-from-workout:${w.id}`)
          .row();
      });

      keyboard.text("Load more").text("Discard").row();

      return ctx.editMessageText("Choose a workout to create new template: ", {
        reply_markup: keyboard,
      });
    }

    if (data === "tpl:main_menu") {
      return ctx.editMessageText("Choose how to create a template: ", {
        reply_markup: methodCreatingKeyboard(),
      });
    }

    if (data.startsWith("tpl:create-from-workout:")) {
      const workoutId = data.split(":")[2];

      if (!workoutId) return;

      const workout = await workoutService.getWorkoutById(+workoutId);
      if (!workout) return ctx.reply("Workout wasn't found.");

      ctx.session.templateDraft = {
        name: `Template from ${new Date(workout.startTime!).toLocaleDateString()}`,
        exercises: workout.exercises.map((ex) => ({
          name: ex.name,
          sets: ex.sets.map((set) => ({ weight: set.weight, reps: set.reps })),
        })),
      };

      ctx.session.templateStage = "idle";

      return ctx.editMessageText(formatTemplate(ctx.session.templateDraft), {
        reply_markup: editingTemplateKeyboard(),
      });
    }

    if (data === "tpl:rename") {
      if (!ctx.session.templateDraft) return;
      ctx.editMessageText("Enter name for the template: ", {
        reply_markup: backKeyboard(),
      });
      ctx.session.templateStage = "await_name";
    }

    if (data === "tpl:discard") {
      resetTemplateDraft(ctx);

      return ctx.editMessageText("Your template was discarded.");
    }

    if (data === "tpl:add_ex") {
      if (!ctx.session.templateDraft) return;

      ctx.reply("Enter name for the new exercise: ", {
        reply_markup: backKeyboard(),
      });
      ctx.session.templateStage = "await_exercise";
    }

    if (data === "tpl:add_set") {
      if (!ctx.session.templateDraft) return;

      ctx.reply("Enter weight and reps for a new set (e.g. 50 x 10): ", {
        reply_markup: backKeyboard(),
      });
      ctx.session.templateStage = "await_set";
    }

    if (data === "tpl:back") {
      ctx.session.templateStage = "idle";
      const draft = ensureTemplateDraft(ctx);
      return ctx.editMessageText(formatTemplate(draft), {
        reply_markup: editingTemplateKeyboard(),
      });
    }
  },
  async handleMessage(ctx: MyContext) {
    const text = ctx.message?.text;
    if (!text) return;

    const stage = ctx.session.templateStage;
    if (stage === "await_name") {
      const activeDraft = ensureTemplateDraft(ctx);
      activeDraft.name = text;
      await ctx.reply(formatTemplate(activeDraft), {
        reply_markup: editingTemplateKeyboard(),
      });
      ctx.session.templateStage = "idle";
      return true;
    }

    if (stage === "await_exercise") {
      const activeDraft = ensureTemplateDraft(ctx);
      activeDraft.exercises.push({ name: text, sets: [] });
      await ctx.reply(formatTemplate(activeDraft), {
        reply_markup: editingTemplateKeyboard(),
      });
      ctx.session.templateStage = "idle";
      return true;
    }

    // if (stage === "await_set") {
    //   const activeDraft = ensureTemplateDraft(ctx);
    //   activeDraft.exercises;
    // }
  },
};
