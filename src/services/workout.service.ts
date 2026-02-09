import { prisma } from "../prisma.js";

type undoResult =
  | { type: "SET_DELETED"; weight: number; reps: number }
  | { type: "EXERCISE_DELETED"; name: string }
  | { type: "NOTHING_TO_DELETE" };

export const workoutService = {
  async createWorkout(userId: number) {
    const date = new Date().toISOString();

    return await prisma.workout.create({
      data: {
        userId: userId,
        startTime: date,
        endTime: date,
      },
    });
  },

  async finishWorkout(workoutId: number) {
    const date = new Date();

    return await prisma.workout.update({
      data: {
        endTime: date,
        isFinished: true,
      },
      where: {
        id: workoutId,
      },
    });
  },

  async cancelWorkout(workoutId: number) {
    return await prisma.workout.delete({
      where: {
        id: workoutId,
      },
    });
  },

  async findExercise(exerciseId: number) {
    return await prisma.set.findMany({
      where: {
        exerciseId: exerciseId,
      },
      orderBy: {
        id: "desc",
      },
    });
  },

  async deleteSet(setId: number) {
    return await prisma.set.delete({
      where: {
        id: setId,
      },
    });
  },

  async findLastWorkouts(userId: number, count: number = 5, page: number = 0) {
    return await prisma.workout.findMany({
      where: {
        userId,
        isFinished: true,
      },
      include: {
        exercises: {
          orderBy: {
            id: "asc",
          },
          include: {
            sets: { orderBy: { id: "asc" } },
          },
        },
      },
      orderBy: {
        startTime: "desc",
      },
      take: count,
      skip: page * count,
    });
  },

  async getWorkoutById(workoutId: number) {
    return await prisma.workout.findUnique({
      where: { id: workoutId },
      include: {
        exercises: {
          include: {
            sets: true,
          },
          orderBy: {
            id: "asc",
          },
        },
      },
    });
  },

  async undoLastLog(exerciseId: number): Promise<undoResult> {
    const sets = await prisma.set.findMany({
      where: {
        exerciseId: exerciseId,
      },
      orderBy: {
        id: "desc",
      },
    });

    if (sets.length > 0) {
      const lastSet = sets[0];
      await prisma.set.delete({
        where: {
          id: lastSet!.id,
        },
      });

      return {
        type: "SET_DELETED",
        weight: lastSet!.weight,
        reps: lastSet!.reps,
      };
    }

    const exercise = await prisma.exercise.findUnique({
      where: {
        id: exerciseId,
      },
    });

    if (exercise) {
      await prisma.exercise.delete({
        where: {
          id: exerciseId,
        },
      });
      return {
        type: "EXERCISE_DELETED",
        name: exercise.name,
      };
    }
    return { type: "NOTHING_TO_DELETE" };
  },

  async addExercise(workoutId: number, name: string) {
    return await prisma.exercise.create({
      data: {
        workoutId,
        name,
      },
    });
  },

  async addSet(exerciseId: number, weight: number, reps: number) {
    return await prisma.set.create({
      data: {
        exerciseId,
        weight,
        reps,
      },
    });
  },
};

export default workoutService;
