import type { Context, SessionFlavor } from "grammy";

export type EditorMode =
  | "idle"
  | "editing"
  | "await_name"
  | "await_exercise"
  | "await_set";

export interface TemplateDraftSet {
  reps: number;
  weight: number;
}
export interface TemplateDraftExercise {
  name: string;
  sets: TemplateDraftSet[];
}
export interface TemplateDraft {
  name: string;
  exercises: TemplateDraftExercise[];
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
