import type { MyContext } from "../types/index.js";
import { calculateWorkoutTime } from "../queries.js";
import { formatDuration } from "../utils/utils.js";
import workoutService from "../services/workout.service.js";
import { InlineKeyboard } from "grammy";
import { templateService } from "../services/template.service.js";

const startNextTemplateExercise = async (ctx: MyContext) => {
  const currentExerciseIdx = ctx.session.templateWorkout?.currentExerciseIdx;
  if (currentExerciseIdx === undefined) return;

  const exercises = ctx.session.templateWorkout?.exercises;
  if (!exercises) return;
  const currentTemplateExercise = exercises[currentExerciseIdx];

  if (!currentTemplateExercise) return;

  const currentExerciseName = currentTemplateExercise?.name;

  if (!ctx.session.activeWorkoutId || currentExerciseName === undefined) return;

  const newExercise = await workoutService.addExercise(
    ctx.session.activeWorkoutId,
    currentExerciseName,
  );

  if (!newExercise) return;

  ctx.session.currentExerciseId = newExercise.id;

  let goalText: string = "Your goal is: \n";
  const targetSets = currentTemplateExercise.sets;

  if (targetSets && targetSets.length > 0) {
    targetSets.forEach((set, idx) => {
      goalText += `Set ${idx + 1}: ${set.weight} × ${set.reps}\n`;
    });
  }

  const keyboard = new InlineKeyboard()
    .text("Next exercise", "wrk:next_tmpl_ex")
    .text("Skip exercise", "wrk:skip_tmpl_ex")
    .row()
    .text("Replace exercise", "wrk:replace_tmpl_ex")
    .text("Additional exercise", "wrk:additional_ex")
    .row();

  return ctx.editMessageText(
    `Current exercise: ${newExercise.name}\n\n` +
      `${goalText}\n` +
      `Enter weight and repetitions (e.g., 50, 5).`,
    { reply_markup: keyboard },
  );
};

export const workoutHandler = {
  async handleNew(ctx: MyContext) {
    if (ctx.session.activeWorkoutId) {
      return ctx.reply(
        "A workout session is already in progress. Please complete or cancel the current session before starting a new one.",
      );
    }

    const keyboard = new InlineKeyboard()
      .text("With template", "wrk:with_tmpl")
      .row()
      .text("Without template", "wrk:without_tmpl")
      .row();

    await ctx.reply("How you want to start new workout?", {
      reply_markup: keyboard,
    });
  },

  async handleCallback(ctx: MyContext) {
    const data = ctx.callbackQuery?.data;
    if (!data) return;

    ctx.answerCallbackQuery();

    if (data === "wrk:with_tmpl") {
      if (ctx.session.activeWorkoutId) {
        return ctx.reply(
          "A workout session is already in progress. Please complete or cancel the current session before starting a new one.",
        );
      }

      const keyboard = new InlineKeyboard();

      const userId = ctx.from?.id;
      if (!userId) return;

      const templates = await templateService.findAllTemplates(userId);

      templates.forEach((tmpl) =>
        keyboard.text(tmpl.name, `wrk:crnt_tmpl:${tmpl.id}`).row(),
      );

      return ctx.reply("Choose a template to start a workout.", {
        reply_markup: keyboard,
      });
    }
    if (data === "wrk:without_tmpl") {
      if (!ctx.from?.id) {
        return ctx.reply(
          "Unable to verify user identification. Please try again.",
        );
      }

      try {
        const userId = ctx.from?.id;
        const workout = await workoutService.createWorkout(userId);

        ctx.session.activeWorkoutId = workout.id;

        await ctx.reply(
          'Workout session initiated. Please enter the name of your first exercise (e.g., "Pull-ups").',
        );
      } catch (error) {
        console.error(error);
        await ctx.reply("Failed to start workout.");
      }
    }

    if (data === "wrk:next_tmpl_ex") {
      if (
        ctx.session.templateWorkout &&
        ctx.session.templateWorkout.currentExerciseIdx !== undefined
      ) {
        ctx.session.templateWorkout.currentExerciseIdx += 1;
        if (
          ctx.session.templateWorkout.currentExerciseIdx <
          ctx.session.templateWorkout.exercises.length
        ) {
          await startNextTemplateExercise(ctx);
        } else {
          await ctx.reply(
            "You have finished all exercises from the template. You can add other exercises or finish current workout using /finish.",
          );
        }
      }
    }

    if (data === "wrk:skip_tmpl_ex") {
      if (
        ctx.session.templateWorkout &&
        ctx.session.templateWorkout.currentExerciseIdx !== undefined
      ) {
        const currentExerciseId = ctx.session.currentExerciseId;
        if (currentExerciseId) {
          try {
            const currentExercise =
              await workoutService.getExerciseById(currentExerciseId);

            if (currentExercise && currentExercise.sets.length === 0) {
              await workoutService.deleteExercise(currentExerciseId);
            }
          } catch (e) {
            console.error(e);
          }
        }

        ctx.session.templateWorkout.currentExerciseIdx += 1;

        if (
          ctx.session.templateWorkout.currentExerciseIdx <
          ctx.session.templateWorkout.exercises.length
        ) {
          await startNextTemplateExercise(ctx);
        } else {
          await ctx.reply(
            "You have finished all exercises from the template. You can add other exercises or finish current workout using /finish.",
          );
        }
      }
    }
    if (data === "wrk:replace_tmpl_ex") {
      if (
        ctx.session.templateWorkout &&
        ctx.session.templateWorkout.currentExerciseIdx !== undefined
      ) {
        ctx.session.workoutMode = "await_replace_name";

        const cancelKeyboard = new InlineKeyboard().text(
          "Back",
          "wrk:cancel_input",
        );

        return ctx.editMessageText(
          "Enter a name for the exercise to replace the current one.",
          { reply_markup: cancelKeyboard },
        );
      }
    }
    if (data === "wrk:additional_ex") {
      if (
        ctx.session.templateWorkout &&
        ctx.session.templateWorkout.currentExerciseIdx !== undefined
      ) {
        ctx.session.workoutMode = "await_extra_name";

        const cancelKeyboard = new InlineKeyboard().text(
          "Back",
          "wrk:cancel_input",
        );

        return ctx.editMessageText(
          "Enter a name for the additional exercise.",
          { reply_markup: cancelKeyboard },
        );
      }
    }

    if (data.startsWith("wrk:crnt_tmpl:")) {
      const currentTemplateId = Number(data.split(":")[2]);
      if (!currentTemplateId)
        return ctx.reply("Couldn't able to find template.");
      if (!ctx.from?.id) {
        return ctx.reply(
          "Unable to verify user identification. Please try again.",
        );
      }

      try {
        const template =
          await templateService.findTemplateById(currentTemplateId);

        if (!template || !template.id || template.exercises.length === 0)
          return ctx.reply("Error while loading template.");

        const newWorkout = await workoutService.createWorkout(ctx.from.id);

        ctx.session.templateWorkout = {
          templateId: template?.id,
          exercises: template.exercises,
          currentExerciseIdx: 0,
        };

        ctx.session.activeWorkoutId = newWorkout.id;

        ctx.session.workoutMode = "template_workout";

        await startNextTemplateExercise(ctx);
      } catch (e) {
        console.error(e);
      }
    }
  },

  async handleFinish(ctx: MyContext) {
    if (!ctx.session.activeWorkoutId) {
      return ctx.reply(
        "No active workout session detected. Use /new to begin a new session.",
      );
    }

    try {
      const workoutId = ctx.session.activeWorkoutId;

      await workoutService.finishWorkout(workoutId);

      if (
        ctx.session.workoutMode === "template_workout" &&
        ctx.session.templateWorkout?.templateId !== undefined
      ) {
        await templateService.updateTemplateProgression(
          ctx.session.templateWorkout.templateId,
          workoutId,
        );
      }
      const duration = await calculateWorkoutTime(workoutId);

      ctx.session.activeWorkoutId = null;
      ctx.session.currentExerciseId = null;
      ctx.session.workoutMode = "idle";
      ctx.session.templateWorkout = null;

      if (!duration) {
        return;
      }

      await ctx.reply(
        "Workout session successfully completed and recorded." +
          `\nSession duration: ${formatDuration(duration)}`,
      );
    } catch (error) {
      console.error(error);
      await ctx.reply("Failed to finish workout.");
    }
  },

  async handleCancel(ctx: MyContext) {
    if (!ctx.session.activeWorkoutId) {
      return ctx.reply(
        "No active workout session found. Use /new to start a new session.",
      );
    }

    try {
      const workoutId = ctx.session.activeWorkoutId;

      await workoutService.cancelWorkout(workoutId);

      ctx.session.activeWorkoutId = null;
      ctx.session.currentExerciseId = null;

      await ctx.reply("Workout session has been canceled successfully.");
    } catch (error) {
      console.error(error);
      await ctx.reply("Failed to cancel workout.");
    }
  },

  async handleUndo(ctx: MyContext) {
    if (!ctx.session.activeWorkoutId) {
      return ctx.reply(
        "No active workout session found. Use /new to start a new session.",
      );
    }

    if (!ctx.session.currentExerciseId) {
      return ctx.reply(
        "No exercise in progress. Please add an exercise first.",
      );
    }

    const exerciseId = ctx.session.currentExerciseId;

    try {
      const result = await workoutService.undoLastLog(exerciseId);

      switch (result.type) {
        case "SET_DELETED":
          await ctx.reply(
            `Last set (${result.weight}kg × ${result.reps}) has been removed.`,
          );
          break;

        case "EXERCISE_DELETED":
          ctx.session.currentExerciseId = null;

          await ctx.reply(
            `Exercise "${result.name}" has been removed (no sets were recorded).`,
          );
          break;

        case "NOTHING_TO_DELETE":
          await ctx.reply("Error: Could not find item to delete.");
          break;
      }
    } catch (error) {
      console.error(error);
      await ctx.reply("Failed to undo last change");
    }
  },

  async handleMessage(ctx: MyContext) {
    const text = ctx.message?.text?.trim();
    if (!text) return;

    if (!ctx.session.activeWorkoutId) {
      return ctx.reply(
        "No active workout session. Please use /new to begin a new session.",
      );
    }

    if (ctx.session.workoutMode === "await_replace_name") {
      const activeWorkoutId = ctx.session.activeWorkoutId;
      const currentExerciseId = ctx.session.currentExerciseId;

      try {
        if (currentExerciseId) {
          const oldExercise =
            await workoutService.getExerciseById(currentExerciseId);
          if (oldExercise && oldExercise.sets.length === 0) {
            await workoutService.deleteExercise(currentExerciseId);
          }
        }

        if (!activeWorkoutId)
          return ctx.reply("You don't have an active workout now.");

        const newExercise = await workoutService.addExercise(
          activeWorkoutId,
          text,
        );

        ctx.session.currentExerciseId = newExercise.id;
        ctx.session.workoutMode = "template_workout";

        const keyboard = new InlineKeyboard()
          .text("Next exercise", "wrk:next_tmpl_ex")
          .text("Skip exercise", "wrk:skip_tmpl_ex")
          .row()
          .text("Replace exercise", "wrk:replace_tmpl_ex")
          .text("Additional exercise", "wrk:additional_ex")
          .row();

        return ctx.reply(
          `The exercise was replaced with ${newExercise.name}.\nEnter weight and repetitions (e.g., 50, 5). `,
          {
            reply_markup: keyboard,
          },
        );
      } catch (e) {
        console.error(e);
        return ctx.reply("An error occured while replacing the exercise.");
      }
    }

    if (ctx.session.workoutMode === "await_extra_name") {
      const activeWorkoutId = ctx.session.activeWorkoutId;

      try {
        if (!activeWorkoutId)
          return ctx.reply("You don't have an active workout now.");
        const newExercise = await workoutService.addExercise(
          activeWorkoutId,
          text,
        );

        ctx.session.currentExerciseId = newExercise.id;
        ctx.session.workoutMode = "template_workout";

        const keyboard = new InlineKeyboard()
          .text("Next exercise", "wrk:next_tmpl_ex")
          .text("Skip exercise", "wrk:skip_tmpl_ex")
          .row()
          .text("Replace exercise", "wrk:replace_tmpl_ex")
          .text("Additional exercise", "wrk:additional_ex")
          .row();

        return ctx.reply(
          `New exercise ${newExercise.name} has created.\nEnter weight and repetitions (e.g., 50, 5). `,
          {
            reply_markup: keyboard,
          },
        );
      } catch (e) {
        console.error(e);
        return ctx.reply("An error occured while adding new exercise.");
      }
    }

    const setRegex = /^(\d+(?:\.\d+)?)[,\s]+(\d+)$/;
    const match = text.match(setRegex);

    if (match && match[1] && match[2]) {
      if (!ctx.session.currentExerciseId) {
        return ctx.reply(
          "Exercise name required. Please specify an exercise before logging sets.",
        );
      }
      const exerciseId = ctx.session.currentExerciseId;
      const weight = parseFloat(match[1]);
      const reps = parseInt(match[2]);

      try {
        await workoutService.addSet(exerciseId, weight, reps);
        if (ctx.session.workoutMode === "template_workout") {
          const keyboard = new InlineKeyboard()
            .text("Next exercise", "wrk:next_tmpl_ex")
            .text("Skip exercise", "wrk:skip_tmpl_ex")
            .row()
            .text("Replace exercise", "wrk:replace_tmpl_ex")
            .text("Additional exercise", "wrk:additional_ex");

          return ctx.reply(`Set recorded: ${weight}kg × ${reps}`, {
            reply_markup: keyboard,
          });
        } else {
          return ctx.reply(`Set recorded: ${weight}kg × ${reps}`);
        }
      } catch (error) {
        console.log(error);
        return ctx.reply("Failed to add set");
      }
    }

    if (ctx.session.workoutMode === "template_workout") {
      return ctx.reply(
        "Enter weight and reps (e.g., 50 10).\n\n" +
          "If you want to add or replace an exercise, please use the buttons under the exercise message.",
      );
    }

    try {
      const activeWorkout = ctx.session.activeWorkoutId;
      const exercise = await workoutService.addExercise(activeWorkout, text);

      ctx.session.currentExerciseId = exercise.id;

      await ctx.reply(
        `Exercise "${text}" has been added.\nPlease enter the weight and repetitions (e.g., 50, 5).`,
      );
    } catch (error) {
      console.log(error);
      return ctx.reply("Failed to add exercise");
    }
  },
};
