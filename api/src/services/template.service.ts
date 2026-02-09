import { prisma } from "../prisma.js";
import type { TemplateDraftExercise } from "../types.js";

export const templateService = {
  async getLastWorkouts(userId: number, limit = 5) {
    return await prisma.workout.findMany({
      where: {
        userId,
        isFinished: true,
      },
      orderBy: {
        startTime: "desc",
      },
      take: limit,
      include: {
        exercises: {
          include: {
            sets: {
              orderBy: { id: "asc" },
            },
          },
          orderBy: { id: "asc" },
        },
      },
    });
  },

  async getWorkoutById(userId: number, workoutId: number) {
    return await prisma.workout.findFirst({
      where: {
        id: workoutId,
        userId,
        isFinished: true,
      },
      include: {
        exercises: {
          include: {
            sets: {
              orderBy: { id: "asc" },
            },
          },
          orderBy: { id: "asc" },
        },
      },
    });
  },

  async createTemplate(
    userId: number,
    name: string,
    exercises: TemplateDraftExercise[],
  ) {
    return await prisma.template.create({
      data: {
        userId,
        name,
        exercises: {
          create: exercises.map((exercise) => ({
            name: exercise.name,
            sets: {
              create: exercise.sets.map((set) => ({
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

export default templateService;
