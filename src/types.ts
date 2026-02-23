import type { Context, SessionFlavor } from "grammy";

export type EditorMode =
  | "idle"
  | "editing"
  | "await_name"
  | "await_exercise"
  | "await_set";

export type WorkoutMode =
  | "idle"
  | "free_workout"
  | "template_workout"
  | "await_replace_name"
  | "await_extra_name";

export interface TemplateTargetSets {
  weight: number;
  reps: number;
}
export interface PlannedExercise {
  name: string;
  sets: TemplateTargetSets[];
}
export interface TemplateWorkout {
  templateId: number;
  exercises: PlannedExercise[];
  currentExerciseIdx: number;
}
export interface TemplateDraftSet {
  reps: number;
  weight: number;
}
export interface TemplateDraftExercise {
  name: string;
  sets: TemplateDraftSet[];
}
export interface TemplateDraft {
  id?: number;
  name: string;
  exercises: TemplateDraftExercise[];
  sourceWorkoutId?: number;
}
export interface SessionData {
  activeWorkoutId: number | null;
  currentExerciseId: number | null;
  workoutMode: WorkoutMode;
  templateWorkout: TemplateWorkout | null;
  templateDraft: TemplateDraft | null;
  templateStage: EditorMode;
  templateCurrentExerciseIdx: number | null;
}

export type MyContext = Context & SessionFlavor<SessionData>;
