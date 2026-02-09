import { calculateWorkoutTime } from "../queries.js";

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

  const duration = await calculateWorkoutTime(workout.id);

  if (duration) {
    text += `\nSession duration: ${formatDuration(duration)}\n\n`;
  }

  return text;
};
