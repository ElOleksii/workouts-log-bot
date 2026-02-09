import { InlineKeyboard } from "grammy";
import type {
  MyContext,
  TemplateDraft,
  TemplateDraftExercise,
} from "../types.js";
import templateService from "../services/template.service.js";

const setRegex = /^(\d+(?:\.\d+)?)[,\s]+(\d+)$/;

const templateMenuKeyboard = () =>
  new InlineKeyboard()
    .text("Create manually", "tpl:manual")
    .text("From last workout", "tpl:from_last");

const templateActionKeyboard = () =>
  new InlineKeyboard()
    .text("Rename", "tpl:rename")
    .text("Add exercise", "tpl:add_ex")
    .text("Add set", "tpl:add_set")
    .row()
    .text("Remove exercise", "tpl:rm_ex")
    .text("Remove set", "tpl:rm_set")
    .row()
    .text("Save template", "tpl:save")
    .text("Discard", "tpl:discard");

const backKeyboard = () => new InlineKeyboard().text("Back", "tpl:back");

const resetTemplateSession = (ctx: MyContext) => {
  ctx.session.templateDraft = null;
  ctx.session.templateStage = "idle";
  ctx.session.templateCurrentExerciseIndex = null;
};

const formatTemplate = (draft: TemplateDraft) => {
  let output = `Template: ${draft.name || "(unnamed)"}\n`;
  if (draft.exercises.length === 0) {
    output += "\nNo exercises yet.";
    return output;
  }

  draft.exercises.forEach((exercise, index) => {
    output += `\n${index + 1}. ${exercise.name}\n`;
    if (exercise.sets.length === 0) {
      output += "   (No sets)\n";
      return;
    }
    exercise.sets.forEach((set, setIndex) => {
      output += `   - Set ${setIndex + 1}: ${set.weight}kg x ${set.reps}\n`;
    });
  });

  return output.trimEnd();
};

const ensureDraft = (ctx: MyContext) => {
  if (!ctx.session.templateDraft) {
    ctx.session.templateDraft = {
      name: "",
      exercises: [],
    };
  }
  return ctx.session.templateDraft;
};

const handleSetInput = (
  draft: TemplateDraft,
  exerciseIndex: number | null,
  input: string,
) => {
  const match = input.match(setRegex);
  if (!match || !match[1] || !match[2]) return false;
  if (exerciseIndex === null || !draft.exercises[exerciseIndex]) return false;

  draft.exercises[exerciseIndex]!.sets.push({
    weight: parseFloat(match[1]),
    reps: parseInt(match[2]),
  });
  return true;
};

const ensureExerciseIndex = (
  draft: TemplateDraft,
  index: number | null,
): index is number => index !== null && !!draft.exercises[index];

const workoutLabel = (date: Date | null | undefined) => {
  if (!date) return "Unknown date";
  return date.toLocaleDateString();
};

export const templateHandler = {
  async handleStart(ctx: MyContext) {
    resetTemplateSession(ctx);
    await ctx.reply(
      "Template creation options:",
      { reply_markup: templateMenuKeyboard() },
    );
  },

  async handleCallback(ctx: MyContext) {
    const data = ctx.callbackQuery?.data;
    if (!data || !data.startsWith("tpl:")) return;

    const userId = ctx.from?.id;
    if (!userId) {
      await ctx.answerCallbackQuery();
      return ctx.reply("User identification not found. Please try again.");
    }

    await ctx.answerCallbackQuery();

    if (data === "tpl:manual") {
      resetTemplateSession(ctx);
      const draft = ensureDraft(ctx);
      ctx.session.templateStage = "await_name";
      await ctx.reply(
        "Send a name for your template.",
        { reply_markup: backKeyboard() },
      );
      return;
    }

    if (data === "tpl:from_last") {
      resetTemplateSession(ctx);
      const workouts = await templateService.getLastWorkouts(userId, 5);
      if (workouts.length === 0) {
        return ctx.reply("No finished workouts found to use as templates.");
      }

      const keyboard = new InlineKeyboard();
      workouts.forEach((workout, index) => {
        const label = `#${index + 1} ${workoutLabel(workout.startTime)}`;
        keyboard.text(label, `tpl:pick:${workout.id}`).row();
      });
      keyboard.text("Back", "tpl:back");

      return ctx.reply(
        "Pick a workout to use as a template:",
        { reply_markup: keyboard },
      );
    }

    if (data.startsWith("tpl:pick:")) {
      const workoutId = Number(data.split(":")[2]);
      const workout = await templateService.getWorkoutById(userId, workoutId);
      if (!workout) {
        return ctx.reply("Workout not found or not finished.");
      }

      const draft: TemplateDraft = {
        name: `Template ${workoutLabel(workout.startTime)}`,
        exercises: workout.exercises.map((exercise) => ({
          name: exercise.name,
          sets: exercise.sets.map((set) => ({
            reps: set.reps,
            weight: set.weight,
          })),
        })),
        sourceWorkoutId: workout.id,
      };

      ctx.session.templateDraft = draft;
      ctx.session.templateStage = "editing";
      ctx.session.templateCurrentExerciseIndex = null;

      return ctx.reply(
        `${formatTemplate(draft)}\n\nMake changes, then save or discard.`,
        { reply_markup: templateActionKeyboard() },
      );
    }

    if (data === "tpl:rename") {
      if (!ctx.session.templateDraft) {
        return ctx.reply("No active template draft.");
      }
      ctx.session.templateStage = "await_name";
      return ctx.reply("Send a new template name.", {
        reply_markup: backKeyboard(),
      });
    }

    if (data === "tpl:add_ex") {
      if (!ctx.session.templateDraft) {
        ctx.session.templateDraft = { name: "", exercises: [] };
      }
      ctx.session.templateStage = "await_exercise";
      return ctx.reply("Send an exercise name to add.", {
        reply_markup: backKeyboard(),
      });
    }

    if (data === "tpl:add_set") {
      const draft = ctx.session.templateDraft;
      if (!draft || draft.exercises.length === 0) {
        return ctx.reply("No exercises yet. Add an exercise first.");
      }

      const keyboard = new InlineKeyboard();
      draft.exercises.forEach((exercise, index) => {
        keyboard.text(exercise.name, `tpl:add_set_ex:${index}`).row();
      });
      keyboard.text("Back", "tpl:back");

      return ctx.reply("Choose an exercise to add a set:", {
        reply_markup: keyboard,
      });
    }

    if (data.startsWith("tpl:add_set_ex:")) {
      const index = Number(data.split(":")[2]);
      const draft = ctx.session.templateDraft;
      if (!draft || !draft.exercises[index]) {
        return ctx.reply("Exercise not found.");
      }
      ctx.session.templateCurrentExerciseIndex = index;
      ctx.session.templateStage = "await_set";
      return ctx.reply("Send weight and reps (e.g., 80, 10).", {
        reply_markup: backKeyboard(),
      });
    }

    if (data === "tpl:rm_ex") {
      const draft = ctx.session.templateDraft;
      if (!draft || draft.exercises.length === 0) {
        return ctx.reply("No exercises to remove.");
      }

      const keyboard = new InlineKeyboard();
      draft.exercises.forEach((exercise, index) => {
        keyboard.text(exercise.name, `tpl:rm_ex_idx:${index}`).row();
      });
      keyboard.text("Back", "tpl:back");

      return ctx.reply("Choose an exercise to remove:", {
        reply_markup: keyboard,
      });
    }

    if (data.startsWith("tpl:rm_ex_idx:")) {
      const index = Number(data.split(":")[2]);
      const draft = ctx.session.templateDraft;
      if (!draft || !draft.exercises[index]) {
        return ctx.reply("Exercise not found.");
      }

      draft.exercises.splice(index, 1);
      if (ctx.session.templateCurrentExerciseIndex !== null) {
        if (ctx.session.templateCurrentExerciseIndex === index) {
          ctx.session.templateCurrentExerciseIndex = null;
        } else if (ctx.session.templateCurrentExerciseIndex > index) {
          ctx.session.templateCurrentExerciseIndex -= 1;
        }
      }

      return ctx.reply(formatTemplate(draft), {
        reply_markup: templateActionKeyboard(),
      });
    }

    if (data === "tpl:rm_set") {
      const draft = ctx.session.templateDraft;
      if (!draft || draft.exercises.length === 0) {
        return ctx.reply("No exercises to remove sets from.");
      }

      const keyboard = new InlineKeyboard();
      draft.exercises.forEach((exercise, index) => {
        keyboard.text(exercise.name, `tpl:rm_set_ex:${index}`).row();
      });
      keyboard.text("Back", "tpl:back");

      return ctx.reply("Choose an exercise:", {
        reply_markup: keyboard,
      });
    }

    if (data.startsWith("tpl:rm_set_ex:")) {
      const index = Number(data.split(":")[2]);
      const draft = ctx.session.templateDraft;
      const exercise = draft?.exercises[index];
      if (!draft || !exercise) {
        return ctx.reply("Exercise not found.");
      }
      if (exercise.sets.length === 0) {
        return ctx.reply("This exercise has no sets.");
      }

      const keyboard = new InlineKeyboard();
      exercise.sets.forEach((set, setIndex) => {
        const label = `${set.weight}kg x ${set.reps}`;
        keyboard.text(label, `tpl:rm_set_idx:${index}:${setIndex}`).row();
      });
      keyboard.text("Back", "tpl:back");

      return ctx.reply("Choose a set to remove:", {
        reply_markup: keyboard,
      });
    }

    if (data.startsWith("tpl:rm_set_idx:")) {
      const [, , exerciseIndex, setIndex] = data.split(":");
      const exIndex = Number(exerciseIndex);
      const sIndex = Number(setIndex);
      const draft = ctx.session.templateDraft;
      const exercise = draft?.exercises[exIndex];
      if (!draft || !exercise || !exercise.sets[sIndex]) {
        return ctx.reply("Set not found.");
      }

      exercise.sets.splice(sIndex, 1);
      return ctx.reply(formatTemplate(draft), {
        reply_markup: templateActionKeyboard(),
      });
    }

    if (data === "tpl:save") {
      const draft = ctx.session.templateDraft;
      if (!draft) {
        return ctx.reply("No active template draft.");
      }
      if (!draft.name) {
        ctx.session.templateStage = "await_name";
        return ctx.reply("Please send a template name before saving.", {
          reply_markup: backKeyboard(),
        });
      }

      await templateService.createTemplate(userId, draft.name, draft.exercises);
      resetTemplateSession(ctx);
      return ctx.reply("Template saved successfully.");
    }

    if (data === "tpl:discard") {
      resetTemplateSession(ctx);
      return ctx.reply("Template discarded.");
    }

    if (data === "tpl:back") {
      if (!ctx.session.templateDraft) {
        resetTemplateSession(ctx);
        return ctx.reply(
          "Template creation options:",
          { reply_markup: templateMenuKeyboard() },
        );
      }
      ctx.session.templateStage = "editing";
      return ctx.reply(formatTemplate(ctx.session.templateDraft), {
        reply_markup: templateActionKeyboard(),
      });
    }
  },

  async handleMessage(ctx: MyContext): Promise<boolean> {
    const text = ctx.message?.text?.trim();
    if (!text) return false;

    const draft = ctx.session.templateDraft;
    const stage = ctx.session.templateStage;

    if (stage === "idle" && !draft) return false;

    if (stage === "await_name") {
      const activeDraft = ensureDraft(ctx);
      activeDraft.name = text;
      ctx.session.templateStage = "editing";
      await ctx.reply(formatTemplate(activeDraft), {
        reply_markup: templateActionKeyboard(),
      });
      return true;
    }

    const activeDraft = ensureDraft(ctx);

    if (
      stage === "await_set" &&
      ensureExerciseIndex(activeDraft, ctx.session.templateCurrentExerciseIndex)
    ) {
      const handled = handleSetInput(
        activeDraft,
        ctx.session.templateCurrentExerciseIndex,
        text,
      );
      if (!handled) {
        await ctx.reply("Please send weight and reps (e.g., 80, 10).");
        return true;
      }

      ctx.session.templateStage = "editing";
      await ctx.reply(formatTemplate(activeDraft), {
        reply_markup: templateActionKeyboard(),
      });
      return true;
    }

    if (handleSetInput(activeDraft, ctx.session.templateCurrentExerciseIndex, text)) {
      await ctx.reply(formatTemplate(activeDraft), {
        reply_markup: templateActionKeyboard(),
      });
      return true;
    }

    if (stage === "await_exercise" || stage === "editing") {
      const newExercise: TemplateDraftExercise = {
        name: text,
        sets: [],
      };
      activeDraft.exercises.push(newExercise);
      ctx.session.templateCurrentExerciseIndex = activeDraft.exercises.length - 1;
      ctx.session.templateStage = "editing";
      await ctx.reply(
        `Exercise "${text}" added. Send sets like "80, 10" or add another exercise.`,
        { reply_markup: templateActionKeyboard() },
      );
      return true;
    }

    return false;
  },
};
