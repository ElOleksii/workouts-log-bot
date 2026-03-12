import workoutService from "../services/workout.service.js";

const KYIV_TIMEZONE = "Europe/Kyiv";

export const getKyivDayBounds = (date: Date) => {
  const kyivDateStr = date.toLocaleDateString("uk-UA", {
    timeZone: KYIV_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const [day, month, year] = kyivDateStr.split(".").map(Number);

  const startOfDay = new Date(
    new Date(year!, month! - 1, day!).toLocaleString("en-US", {
      timeZone: KYIV_TIMEZONE,
    }),
  );
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(startOfDay);
  endOfDay.setHours(23, 59, 59, 999);

  return { startOfDay, endOfDay };
};

export const formatKyivDate = (date: Date): string => {
  return date.toLocaleDateString("uk-UA", {
    timeZone: KYIV_TIMEZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatDuration = (totalSeconds: number): string => {
  if (totalSeconds < 0) {
    throw new Error("Duration cannot be negative");
  }

  if (totalSeconds < 60) {
    return `${totalSeconds} second${totalSeconds === 1 ? "" : "s"}`;
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours} hour${hours === 1 ? "" : "s"}`);
  }

  if (minutes > 0) {
    parts.push(`${minutes} minute${minutes === 1 ? "" : "s"}`);
  }

  return parts.join(" ");
};

export const formatWorkoutSummary = async (workout: any): Promise<string> => {
  let text: string = "";

  if (!workout.exercises || workout.exercises.length === 0) {
    text += `No exercises recorded.\n`;
    console.log(workout);
    return text;
  }

  const startTime = workout.startTime
    ? formatTime(new Date(workout.startTime))
    : "Unknown";
  const endTime = workout.endTime
    ? formatTime(new Date(workout.endTime))
    : "...";

  text += `**Workout at ${startTime} - ${endTime}**\n`;

  if (workout.exercises.length === 0) {
    text += `_No exercises recorded._\n`;
  }

  workout.exercises?.forEach((exercise: any, index: number) => {
    text += `\n${index + 1}. **${exercise.name}**\n`;

    if (exercise.sets.length > 0) {
      exercise.sets.forEach((set: any, setIndex: number) => {
        text += `   - Set ${setIndex + 1}: ${set.weight}kg × ${set.reps}\n`;
      });
    } else {
      text += `   (No sets recorded)\n`;
    }
  });

  const duration = await workoutService.calculateWorkoutTime(workout.id);

  if (duration) {
    text += `\nSession duration: ${formatDuration(duration)}\n\n`;
  }

  return text;
};

const formatTime = (date: Date): string =>
  date.toLocaleTimeString("uk-UA", {
    timeZone: KYIV_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
