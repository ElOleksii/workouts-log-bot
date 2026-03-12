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
