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
  id?: number;
  name: string;
  exercises: TemplateDraftExercise[];
  sourceWorkoutId?: number;
}
