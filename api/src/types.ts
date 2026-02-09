import type { Context, SessionFlavor } from "grammy";

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

export type TemplateStage =
  | "idle"
  | "editing"
  | "await_name"
  | "await_exercise"
  | "await_set";

export interface SessionData {
  activeWorkoutId: number | null;
  currentExerciseId: number | null;
  templateDraft: TemplateDraft | null;
  templateStage: TemplateStage;
  templateCurrentExerciseIndex: number | null;
}

export type MyContext = Context & SessionFlavor<SessionData>;
