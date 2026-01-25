import "dotenv/config";
import { Bot, Context, session } from "grammy";
import { prisma } from "./prisma";
import { calculateWorkoutTime } from "./queries";
import { formatDuration } from "./utils";
const bot = new Bot(process.env.BOT_TOKEN);
const initial = () => {
    return {
        activeWorkoutId: null,
        currentExerciseId: null,
    };
};
bot.use(session({ initial }));
await bot.api.setMyCommands([
    { command: "new", description: "Start new workout" },
    { command: "finish", description: "Finish current workout" },
    { command: "cancel", description: "Cancel current workout" },
    { command: "find", description: "Find a workout(s) by date" },
    // { command: "persona", description: "Select a bot persona" },
]);
bot.command("start", async (ctx) => {
    await ctx.reply("Hi, Sir! I'm your personal Gym Assistant and I'm here to log your workout\n\n." +
        "Commands\n" +
        "/new - Start new workout\n" +
        "/finish - Finish current workout\n" +
        "/cancel - Cancel current workout\n\n" +
        "How it works:\n" +
        "1. Write a name of the exercise ('Pull-ups', for example)" +
        "2. Write current weight and reps the set ('80, 12', for exmaple)" +
        "3. Repeat for new exercises");
});
bot.command("new", async (ctx) => {
    if (ctx.session.activeWorkoutId) {
        return ctx.reply("Sir, you are training now. Finish current workout first.");
    }
    if (!ctx.from?.id) {
        return ctx.reply("Cannot start workout: user ID not found.");
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
    await ctx.reply('Sir, workout has started, good luck! Write a name of the first exercise ("Pull-ups", for example)');
});
bot.command("finish", async (ctx) => {
    if (!ctx.session.activeWorkoutId) {
        return ctx.reply("Sir, you are not training right now. Start a workout first.");
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
    await ctx.reply("Great job, sir. Your workout has been recorded." +
        `\nTime for this training ${formatDuration(duration)}`);
});
bot.command("cancel", async (ctx) => {
    if (!ctx.session.activeWorkoutId) {
        return ctx.reply("Sir, you are not training right now. Start a workout first.");
    }
    const currentWorkout = ctx.session.activeWorkoutId;
    await prisma.workout.delete({
        where: {
            id: currentWorkout,
        },
    });
    ctx.session.activeWorkoutId = null;
    ctx.session.currentExerciseId = null;
    await ctx.reply("Sir, your current workout has canceled. Take care.");
});
bot.command("find", async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId)
        return ctx.reply("User ID not found.");
    const dateRegex = /^(\d{1,2})([.\s])(\d{1,2})(?:\2(\d{2}|\d{4}))?$/;
    const inputDate = typeof ctx.match === "string" ? ctx.match.trim() : "";
    let targetDate = new Date();
    if (inputDate) {
        const match = inputDate.match(dateRegex);
        if (!match) {
            return ctx.reply("Invalid date format. Please use DD.MM.YYYY, DD MM YYYY, DD.MM.YY or DD.MM");
        }
        let day = parseInt(match[1]);
        let month = parseInt(match[3]);
        let year;
        if (match[4]) {
            year =
                match[4].length === 2 ? 2000 + parseInt(match[4]) : parseInt(match[4]);
        }
        else {
            year = new Date().getFullYear();
        }
        targetDate = new Date(year, month - 1, day);
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
        return ctx.reply(`No workouts founded for ${dateString}`);
    }
    let responseMessage = length >= 2
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
        responseMessage += `🏋️‍♂️ **Workout at ${startTime} - ${endTime}**\n`;
        if (workout.exercises.length === 0) {
            responseMessage += `_No exercises recorded._\n`;
        }
        workout.exercises.forEach((exercise, index) => {
            responseMessage += `\n${index + 1}. **${exercise.name}**\n`;
            if (exercise.sets.length > 0) {
                exercise.sets.forEach((set, setIndex) => {
                    responseMessage += `   - Set ${setIndex + 1}: ${set.weight}kg × ${set.reps}\n`;
                });
            }
            else {
                responseMessage += `   (No sets)\n`;
            }
        });
        const duration = await calculateWorkoutTime(workout.id);
        if (!duration)
            return;
        responseMessage += `\nTime for this training ${formatDuration(duration)}`;
    }
    await ctx.reply(responseMessage, { parse_mode: "Markdown" });
});
bot.on("message:text", async (ctx) => {
    const text = ctx.message.text.trim();
    if (!ctx.session.activeWorkoutId) {
        return ctx.reply("Sir, you must start a new training first using /new.");
    }
    const setRegex = /^(\d+(?:\.\d+)?)[,\s]+(\d+)$/;
    const match = text.match(setRegex);
    if (match && match[1] && match[2]) {
        if (!ctx.session.currentExerciseId) {
            return ctx.reply("Sir, you must write name of the exercise.");
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
    }
    else {
        const activeWorkout = ctx.session.activeWorkoutId;
        const exercise = await prisma.exercise.create({
            data: {
                workoutId: activeWorkout,
                name: text,
            },
        });
        ctx.session.currentExerciseId = exercise.id;
        await ctx.reply(`Sir, the your current exercise ${text}\nNext step - provide weight and reps (50, 5 - for example).`);
    }
});
bot.start();
//# sourceMappingURL=bot.js.map