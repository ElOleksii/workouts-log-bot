import type { MyContext } from "../types.js";
import { calculateWorkoutTime } from "../queries.js";
import { formatDuration } from "../utils/utils.js";
import workoutService from "../services/workout.service.js";

export const workoutHandler = {
  async handleNew(ctx: MyContext) {
    if (ctx.session.activeWorkoutId) {
      return ctx.reply(
        "A workout session is already in progress. Please complete or cancel the current session before starting a new one.",
      );
    }

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

      const duration = await calculateWorkoutTime(workoutId);

      ctx.session.activeWorkoutId = null;
      ctx.session.currentExerciseId = null;

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
        // await ctx.reply("Set recorded.")
      } catch (error) {
        console.log(error);
        return ctx.reply("Failed to add set");
      }
      return;
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
