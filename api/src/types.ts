import type { Context, SessionFlavor } from "grammy";

export type EditorMode =
  | "idle"
  | "editing"
  | "await_name"
  | "await_exercise"
  | "await_set";

export interface TemplateDraft {
  name: string;
  exercises: Array<{
    name: string;
    sets: Array<{
      reps: number;
      weight: number;
    }>;
  }>;
  sourceWorkoutId?: number;
}
export interface SessionData {
  activeWorkoutId: number | null;
  currentExerciseId: number | null;
  templateDraft: TemplateDraft | null;
  templateStage: EditorMode;
  templateCurrentExerciseIdx: number | null;
}

export type MyContext = Context & SessionFlavor<SessionData>;
