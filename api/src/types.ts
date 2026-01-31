import type { Context, SessionFlavor } from "grammy";

export interface SessionData {
  activeWorkoutId: number | null;
  currentExerciseId: number | null;
}

export type MyContext = Context & SessionFlavor<SessionData>;
