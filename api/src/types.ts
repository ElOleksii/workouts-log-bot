import type { Context, SessionFlavor } from "grammy";

export type EditorMode =
  | "MENU"
  | "EDIT_EXERCISE"
  | "EDIT_SET"
  | "RENAME_TEMPLATE";

export interface TemplateDraft {
  name: string;
  exercises: Array<{
    name: string;
    sets: Array<{
      reps: number;
      weight: number;
    }>;
  }>;
}
export interface SessionData {
  activeWorkoutId: number | null;
  currentExerciseId: number | null;
  templateDraft: TemplateDraft | null;
  editorMode: EditorMode | null;
  editingIndex: number | null;
}

export type MyContext = Context & SessionFlavor<SessionData>;
