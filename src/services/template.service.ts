import { prisma } from "../prisma.js";
import type { TemplateDraftExercise } from "../types.js";

export const templateService = {
  async createTemplate(
    userId: number,
    name: string,
    exercises: TemplateDraftExercise[],
  ) {
    return prisma.template.create({
      data: {
        userId,
        name,
        exercises: {
          create: exercises.map((ex) => ({
            name: ex.name,
            sets: {
              create: ex.sets.map((set) => ({
                reps: set.reps,
                weight: set.weight,
              })),
            },
          })),
        },
      },
    });
  },
};
