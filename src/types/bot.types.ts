import type { Context, SessionFlavor } from "grammy";
import type { WorkoutMode, TemplateWorkout } from "./workout.types.js";
import type { TemplateDraft, EditorMode } from "./template.types.js";

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
