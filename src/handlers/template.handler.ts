import { InlineKeyboard } from "grammy";
import type { MyContext, TemplateDraft } from "../types.js";
import workoutService from "../services/workout.service.js";
import { formatWorkoutSummary } from "../utils/utils.js";
import { templateService } from "../services/template.service.js";

const methodCreatingKeyboard = () =>
  new InlineKeyboard()
    .text("Manually", "tpl:manually")
    .text("From past workouts", "tpl:from_past")
    .row();

const editingTemplateKeyboard = (draft: TemplateDraft) => {
  const keyboard = new InlineKeyboard()
    .text("Rename", "tpl:rename")
    .text("Add exercise", "tpl:add_ex")
    .text("Add set", "tpl:add_set")
    .row()
    .text("Remove exercise", "tpl:remove_ex")
    .text("Remove set", "tpl:remove_set")
    .row()
    .text("Save", "tpl:save")
    .text("Discard", "tpl:discard");

  if (draft.id) {
    keyboard.text("Delete", "tpl:delete").row();
  }

  return keyboard;
};
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

const handleSetInput = (
  draft: TemplateDraft,
  exerciseIdx: number | null,
  input: string,
): exerciseIdx is number =>
  exerciseIdx !== null && !!draft.exercises[exerciseIdx];

export const templateHandler = {
  async handleTemplateCreating(ctx: MyContext) {
    resetTemplateDraft(ctx);
    return ctx.reply("Choose how to create a template: ", {
      reply_markup: methodCreatingKeyboard(),
    });
  },

  async handleManageTemplates(ctx: MyContext) {
    const userId = ctx.from?.id;
    if (!userId) return;

    const keyboard = new InlineKeyboard();

    const templates = await templateService.findAllTemplates(userId);

    if (!templates || templates.length === 0) {
      return ctx.reply(
        "You don't have any templates yet. You can create one using /new_template.",
      );
    }

    templates.forEach((tmpl) => {
      keyboard.text(`${tmpl.name}`, `tpl:mng_tpl:${tmpl.id}`).row();
    });

    keyboard.text("Discard", "tpl:discard").row();

    return ctx.reply("Choose a template from the list to manage it.", {
      reply_markup: keyboard,
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
        reply_markup: editingTemplateKeyboard(currentTemplate),
      });
    }

    if (data.startsWith("tpl:mng_tpl:")) {
      console.log(data);
      const templateId = Number(data.split(":")[2]);
      if (!templateId) return;

      const template = await templateService.findTemplateById(templateId);
      if (!template) return ctx.reply("Couldn't find the template.");

      const draft: TemplateDraft = {
        id: template.id,
        name: template.name,
        exercises: template.exercises,
      };

      ctx.session.templateDraft = draft;
      ctx.session.templateStage = "editing";
      ctx.session.templateCurrentExerciseIdx = null;

      return ctx.editMessageText(formatTemplate(draft), {
        reply_markup: editingTemplateKeyboard(draft),
      });
    }

    if (data === "tpl:from_past") {
      resetTemplateDraft(ctx);
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
        keyboard.text(`Workout for ${dataStr}`, `tpl:pick:${w.id}`).row();
      });

      keyboard.text("Load more").text("Discard", "tpl:discard").row();

      return ctx.editMessageText("Choose a workout to create new template: ", {
        reply_markup: keyboard,
      });
    }

    if (data === "tpl:main_menu") {
      return ctx.editMessageText("Choose how to create a template: ", {
        reply_markup: methodCreatingKeyboard(),
      });
    }

    if (data.startsWith("tpl:pick:")) {
      const workoutId = data.split(":")[2];

      if (!workoutId) return;

      const workout = await workoutService.getWorkoutById(+workoutId);
      if (!workout) return ctx.reply("Workout wasn't found.");

      const draft: TemplateDraft = {
        name: `Template from ${new Date(workout.startTime!).toLocaleDateString()}`,
        exercises: workout.exercises.map((ex) => ({
          name: ex.name,
          sets: ex.sets.map((set) => ({ weight: set.weight, reps: set.reps })),
        })),
        sourceWorkoutId: +workoutId,
      };

      ctx.session.templateDraft = draft;
      ctx.session.templateStage = "editing";
      ctx.session.templateCurrentExerciseIdx = null;

      return ctx.editMessageText(formatTemplate(ctx.session.templateDraft), {
        reply_markup: editingTemplateKeyboard(draft),
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
      const draft = ctx.session.templateDraft;
      if (!draft || draft.exercises.length === 0) {
        return ctx.reply("No exercises yet. Add an exercise first.");
      }

      const keyboard = new InlineKeyboard();
      draft.exercises.forEach((ex, idx) => {
        keyboard.text(ex.name, `tpl:add_set_to_ex:${idx}`).row();
      });
      keyboard.text("Back", "tpl:back");

      ctx.editMessageText("Choose an exercise to add a set", {
        reply_markup: keyboard,
      });
    }

    if (data.includes("tpl:add_set_to_ex:")) {
      const exerciseIdx = Number(data.split(":")[2]);
      const draft = ctx.session.templateDraft;
      if (!draft || draft.exercises.length === 0) {
        return ctx.reply("No exercises yet. Add an exercise first.");
      }

      ctx.session.templateCurrentExerciseIdx = exerciseIdx;
      ctx.session.templateStage = "await_set";

      return ctx.editMessageText("Enter weight and reps (e.g. 50 10).", {
        reply_markup: backKeyboard(),
      });
    }

    if (data === "tpl:remove_ex") {
      const draft = ctx.session.templateDraft;
      if (!draft || draft.exercises.length === 0) {
        return ctx.reply("No exercises yet. Add an exercise first.");
      }

      const keyboard = new InlineKeyboard();

      draft.exercises.forEach((ex, idx) => {
        keyboard.text(ex.name, `tpl:remove_ex:${idx}`).row();
      });

      return ctx.editMessageText("Choose an exercise to remove.", {
        reply_markup: keyboard,
      });
    }

    if (data.includes("tpl:remove_ex:")) {
      const exerciseIdx = Number(data.split(":")[2]);
      let draft = ctx.session.templateDraft;
      if (!draft || draft.exercises.length === 0) {
        return ctx.reply("No exercises yet. Add an exercise first.");
      }

      draft.exercises = draft.exercises.filter(
        (ex, idx) => exerciseIdx !== idx,
      );

      return ctx.editMessageText(formatTemplate(draft), {
        reply_markup: editingTemplateKeyboard(draft),
      });
    }

    if (data === "tpl:remove_set") {
      const draft = ctx.session.templateDraft;
      if (!draft || draft.exercises.length === 0) {
        return ctx.reply("No exercises yet. Add an exercise first.");
      }

      const keyboard = new InlineKeyboard();

      draft.exercises.forEach((ex, idx) => {
        keyboard.text(ex.name, `tpl:ex_set_to_remove:${idx}`).row();
      });

      return ctx.editMessageText("Choose exercise to remove the set.", {
        reply_markup: keyboard,
      });
    }

    if (data.includes("tpl:ex_set_to_remove:")) {
      const exerciseIdx = Number(data.split(":")[2]);
      const draft = ctx.session.templateDraft;
      if (!draft || draft.exercises.length === 0) {
        return ctx.reply("No exercises yet. Add an exercise first.");
      }

      const currentExercise = draft.exercises[exerciseIdx];
      if (currentExercise?.sets.length === 0) {
        return ctx.reply(
          `${currentExercise?.name} don't contain any sets yet.`,
        );
      }
      const keyboard = new InlineKeyboard();
      currentExercise?.sets.forEach((set, idx) => {
        keyboard
          .text(
            `${idx + 1}. ${set.weight} x ${set.reps}`,
            `tpl:remove_set:${exerciseIdx}:${idx}`,
          )
          .row();
      });

      return ctx.editMessageText("Choose set to remove.", {
        reply_markup: keyboard,
      });
    }

    if (data.startsWith("tpl:remove_set:")) {
      const exerciseIdx = Number(data.split(":")[2]);
      const setIdx = Number(data.split(":")[3]);
      const draft = ctx.session.templateDraft;
      if (!draft || draft.exercises.length === 0) {
        return ctx.reply("No exercises yet. Add an exercise first.");
      }

      let currentExercise = draft.exercises[exerciseIdx];
      if (currentExercise === undefined) {
        return;
      }

      currentExercise.sets = currentExercise.sets.filter(
        (set, idx) => idx !== setIdx,
      );

      return ctx.editMessageText(formatTemplate(draft), {
        reply_markup: editingTemplateKeyboard(draft),
      });
    }

    if (data === "tpl:back") {
      ctx.session.templateStage = "idle";
      const draft = ensureTemplateDraft(ctx);
      return ctx.editMessageText(formatTemplate(draft), {
        reply_markup: editingTemplateKeyboard(draft),
      });
    }

    if (data === "tpl:save") {
      const draft = ctx.session.templateDraft;
      if (!draft || draft.exercises.length === 0) {
        return ctx.reply("No exercises yet. Add an exercise first.");
      }

      if (!draft.name) {
        ctx.session.templateStage = "await_name";
        return ctx.editMessageText(
          "Provide the name for a template before saving",
          {
            reply_markup: backKeyboard(),
          },
        );
      }

      const userId = ctx.from?.id;
      if (!userId) return;

      if (draft.id) {
        await templateService.updateTemplate(
          draft.id,
          draft.name,
          draft.exercises,
        );
        resetTemplateDraft(ctx);
        return ctx.editMessageText("Template was successfuly updated.");
      } else {
        await templateService.createTemplate(
          userId,
          draft.name,
          draft.exercises,
        );
        resetTemplateDraft(ctx);

        return ctx.editMessageText("Template was successfuly created.");
      }
    }

    if (data === "tpl:delete") {
      const currentTemplateId = ctx.session.templateDraft?.id;
      if (!currentTemplateId) return;

      try {
        await templateService.deleteTemplate(currentTemplateId);
        ctx.editMessageText("The template was deleted successfully.");
        resetTemplateDraft(ctx);
      } catch (e) {
        console.log(e);
        return ctx.reply("Couldn't able to delete this template.");
      }
    }
  },
  async handleMessage(ctx: MyContext): Promise<Boolean> {
    const text = ctx.message?.text;
    if (!text) return false;

    if (ctx.session.templateStage === "idle" || !ctx.session.templateDraft) {
      return false;
    }

    const stage = ctx.session.templateStage;
    if (stage === "await_name") {
      const activeDraft = ensureTemplateDraft(ctx);
      activeDraft.name = text;
      await ctx.reply(formatTemplate(activeDraft), {
        reply_markup: editingTemplateKeyboard(activeDraft),
      });
      ctx.session.templateStage = "editing";
      return true;
    }

    if (stage === "await_exercise") {
      const activeDraft = ensureTemplateDraft(ctx);
      activeDraft.exercises.push({ name: text, sets: [] });
      await ctx.reply(formatTemplate(activeDraft), {
        reply_markup: editingTemplateKeyboard(activeDraft),
      });
      ctx.session.templateStage = "editing";
      return true;
    }

    if (stage === "await_set") {
      const activeDraft = ensureTemplateDraft(ctx);
      const handled = handleSetInput(
        activeDraft,
        ctx.session.templateCurrentExerciseIdx,
        text,
      );
      if (!handled) {
        await ctx.reply("Please provide weight and reps (e.g., 50 10)");
        return true;
      }

      const setRegex = /^(\d+(?:\.\d+)?)[,\s]+(\d+)$/;
      const match = text.match(setRegex);
      if (match && match[1] && match[2]) {
        const weight = parseFloat(match[1]);
        const reps = parseInt(match[2]);
        const currentExerciseIdx = ctx.session.templateCurrentExerciseIdx;

        if (currentExerciseIdx === null) return true;

        const currentExercise = activeDraft.exercises[currentExerciseIdx];
        currentExercise?.sets.push({ reps, weight });
      } else {
        await ctx.reply("Please provide weight and reps (e.g., 50 10)");
        return true;
      }

      await ctx.reply(formatTemplate(activeDraft), {
        reply_markup: editingTemplateKeyboard(activeDraft),
      });
      ctx.session.templateStage = "editing";
      return true;
    }

    return false;
  },
};
