import "dotenv/config";
import { Bot, Context, session, type SessionFlavor } from "grammy";
import { prisma } from "./prisma.js";
import { calculateWorkoutTime } from "./queries.js";
import { formatDuration } from "./utils.js";
import IORedis from "ioredis";
import { RedisAdapter } from "@grammyjs/storage-redis";

interface SessionData {
  activeWorkoutId: number | null;
  currentExerciseId: number | null;
}

type MyContext = Context & SessionFlavor<SessionData>;

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not defined in environment variables");
}

const redisInstance = new IORedis(process.env.REDIS_URL);

export const bot = new Bot<MyContext>(process.env.BOT_TOKEN!);
const initial = (): SessionData => {
  return {
    activeWorkoutId: null,
    currentExerciseId: null,
  };
};

bot.use(
  session({
    initial,
    storage: new RedisAdapter({ instance: redisInstance, ttl: 3600 * 4 }),
  }),
);

bot.command("start", async (ctx) => {
  await ctx.reply(
    "Welcome to the Workout Logging System. This service helps you track and manage your training sessions.\n\n" +
      "Available Commands:\n" +
      "/new - Start a new workout session\n" +
      "/finish - Complete the current workout session\n" +
      "/cancel - Cancel the current workout session\n" +
      "/undo - Remove the last set or exercise if empty\n" +
      "/find - Retrieve workouts by date (format: DD.MM.YYYY, DD MM YYYY, or DD.MM.YY)\n\n" +
      "Usage Instructions:\n" +
      "1. Enter the exercise name (e.g., 'Pull-ups')\n" +
      "2. Enter the weight and repetitions (e.g., '80, 12')\n" +
      "3. Continue with additional exercises as needed\n",
  );
});

bot.command("new", async (ctx) => {
  if (ctx.session.activeWorkoutId) {
    return ctx.reply(
      "A workout session is already in progress. Please complete or cancel the current session before starting a new one.",
    );
  }

  if (!ctx.from?.id) {
    return ctx.reply("Unable to verify user identification. Please try again.");
  }
  const userId = ctx.from?.id;
  const date = new Date().toISOString();

  const workout = await prisma.workout.create({
    data: {
      userId: userId,
      startTime: date,
      endTime: date,
    },
  });

  ctx.session.activeWorkoutId = workout.id;

  await ctx.reply(
    'Workout session initiated. Please enter the name of your first exercise (e.g., "Pull-ups").',
  );
});

bot.command("finish", async (ctx) => {
  if (!ctx.session.activeWorkoutId) {
    return ctx.reply(
      "No active workout session detected. Use /new to begin a new session.",
    );
  }

  const currentWorkout = ctx.session.activeWorkoutId;
  const date = new Date();

  await prisma.workout.update({
    data: {
      endTime: date,
      isFinished: true,
    },
    where: {
      id: currentWorkout,
    },
  });

  const duration = await calculateWorkoutTime(currentWorkout);

  ctx.session.activeWorkoutId = null;
  ctx.session.currentExerciseId = null;

  if (!duration) {
    return;
  }

  await ctx.reply(
    "Workout session successfully completed and recorded." +
      `\nSession duration: ${formatDuration(duration)}`,
  );
});

bot.command("cancel", async (ctx) => {
  if (!ctx.session.activeWorkoutId) {
    return ctx.reply(
      "No active workout session found. Use /new to start a new session.",
    );
  }

  const currentWorkout = ctx.session.activeWorkoutId;

  await prisma.workout.delete({
    where: {
      id: currentWorkout,
    },
  });

  ctx.session.activeWorkoutId = null;
  ctx.session.currentExerciseId = null;

  await ctx.reply("Workout session has been canceled successfully.");
});

bot.command("undo", async (ctx) => {
  if (!ctx.session.activeWorkoutId) {
    return ctx.reply(
      "No active workout session found. Use /new to start a new session.",
    );
  }

  if (!ctx.session.currentExerciseId) {
    return ctx.reply("No exercise in progress. Please add an exercise first.");
  }

  const currentExerciseId = ctx.session.currentExerciseId;

  // Find all sets for the current exercise, ordered by id descending
  const sets = await prisma.set.findMany({
    where: {
      exerciseId: currentExerciseId,
    },
    orderBy: {
      id: "desc",
    },
  });

  if (sets.length > 0) {
    // Delete the last set
    const lastSet = sets[0];
    if (!lastSet) {
      return ctx.reply("An error occurred. Please try again.");
    }

    await prisma.set.delete({
      where: {
        id: lastSet.id,
      },
    });

    await ctx.reply(
      `Last set (${lastSet.weight}kg × ${lastSet.reps}) has been removed.`,
    );
  } else {
    // No sets exist, delete the exercise itself
    const exercise = await prisma.exercise.findUnique({
      where: {
        id: currentExerciseId,
      },
    });

    if (exercise) {
      await prisma.exercise.delete({
        where: {
          id: currentExerciseId,
        },
      });

      ctx.session.currentExerciseId = null;

      await ctx.reply(
        `Exercise "${exercise.name}" has been removed (no sets were recorded).`,
      );
    }
  }
});

bot.command("find", async (ctx) => {
  const userId = ctx.from?.id;
  if (!userId)
    return ctx.reply("User identification not found. Please try again.");

  const dateRegex = /^(\d{1,2})([.\s])(\d{1,2})(?:\2(\d{2}|\d{4}))?$/;

  const inputDate = typeof ctx.match === "string" ? ctx.match.trim() : "";
  let targetDate = new Date();

  if (inputDate) {
    const match = inputDate.match(dateRegex);
    if (!match) {
      return ctx.reply(
        "Invalid date format. Please use one of the following formats: DD.MM.YYYY, DD MM YYYY, DD.MM.YY, or DD.MM",
      );
    }

    let day = parseInt(match[1]!);
    let month = parseInt(match[3]!);
    let year: number;

    if (match[4]) {
      year =
        match[4].length === 2 ? 2000 + parseInt(match[4]) : parseInt(match[4]);
    } else {
      year = new Date().getFullYear();
    }

    targetDate = new Date(year, month - 1, day);
  } else {
    const lastWorkout = await prisma.workout.findFirst({
      where: {
        userId,
        isFinished: true,
      },
      orderBy: {
        startTime: "desc",
      },
    });

    if (!lastWorkout || !lastWorkout.startTime) {
      return ctx.reply("No completed workouts found.");
    }

    targetDate = new Date(lastWorkout.startTime);
  }

  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 0);

  const workouts = await prisma.workout.findMany({
    where: {
      userId: userId,
      startTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
      isFinished: true,
    },
    include: {
      exercises: {
        include: {
          sets: true,
        },
      },
    },
    orderBy: {
      startTime: "asc",
    },
  });

  if (workouts.length === 0) {
    const dateString = targetDate.toLocaleDateString();
    return ctx.reply(`No workout sessions found for ${dateString}.`);
  }

  console.log(workouts.length);

  let responseMessage =
    workouts.length >= 2
      ? `**Workouts for ${targetDate.toLocaleDateString()}:**\n\n`
      : "";

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

    if (!duration) return;

    responseMessage += `\nSession duration: ${formatDuration(duration)}`;
  }

  await ctx.reply(responseMessage, { parse_mode: "Markdown" });
});

bot.on("message:text", async (ctx) => {
  const text = ctx.message.text.trim();

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

    const currentExercise = ctx.session.currentExerciseId;
    const weight = parseFloat(match[1]);
    const reps = parseInt(match[2]);

    await prisma.set.create({
      data: {
        exerciseId: currentExercise,
        weight: weight,
        reps: reps,
      },
    });

    // await ctx.reply("Understood, Sir, the set is has been recorded.");
  } else {
    const activeWorkout = ctx.session.activeWorkoutId;

    const exercise = await prisma.exercise.create({
      data: {
        workoutId: activeWorkout,
        name: text,
      },
    });

    ctx.session.currentExerciseId = exercise.id;

    await ctx.reply(
      `Exercise "${text}" has been added.\nPlease enter the weight and repetitions (e.g., 50, 5).`,
    );
  }
});

bot.catch((err) => {
  console.error("Error inside bot logic:", err);
});
