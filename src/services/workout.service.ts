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

  async getExerciseById(exerciseId: number) {
    return prisma.exercise.findUnique({
      where: {
        id: exerciseId,
      },
      include: {
        sets: true,
      },
    });
  },

  async deleteExercise(exerciseId: number) {
    return prisma.exercise.delete({
      where: {
        id: exerciseId,
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
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
      include: {
        sets: { orderBy: { id: "desc" }, take: 1 },
      },
    });

    if (!exercise) return { type: "NOTHING_TO_DELETE" };

    if (exercise.sets.length > 0) {
      const lastSet = exercise.sets[0]!;
      await prisma.set.delete({ where: { id: lastSet.id } });
      return {
        type: "SET_DELETED",
        weight: lastSet.weight,
        reps: lastSet.reps,
      };
    }

    await prisma.exercise.delete({
      where: { id: exercise.id },
    });
    return { type: "EXERCISE_DELETED", name: exercise.name };
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

  async calculateWorkoutTime(workoutId: number) {
    const workout = await prisma.workout.findUnique({
      where: {
        id: workoutId,
      },
      select: {
        startTime: true,
        endTime: true,
      },
    });

    if (!workout || !workout.startTime || !workout.endTime) {
      return null;
    }

    const duration = workout.endTime?.getTime() - workout.startTime?.getTime();
    return Math.round(duration / 1000);
  },

  async skipExercise(exerciseId: number) {
    const exercise = prisma.exercise.findUnique({
      where: { id: exerciseId },
      include: {
        sets: true,
      },
    });

    if (exercise && exercise.sets.length === 0) {
      await prisma.exercise.delete({
        where: { id: exerciseId },
      });
    }
  },

  async replaceExercise(
    workoutId: number,
    oldExerciseId: number,
    newName: string,
  ) {
    const oldExercise = await prisma.exercise.findUnique({
      where: {
        id: oldExerciseId,
      },
      include: {
        sets: true,
      },
    });

    if (oldExercise && oldExercise.sets.length === 0) {
      await prisma.exercise.delete({
        where: { id: oldExerciseId },
      });

      return prisma.exercise.create({
        data: {
          workoutId,
          name: newName,
        },
      });
    }
  },

  async startWorkoutFromTemplate(templateId: number, userId: number) {
    const template = await prisma.template.findUnique({
      where: { id: templateId },
      include: {
        exercises: {
          include: {
            sets: true,
          },
        },
      },
    });

    if (!template || template.exercises.length === 0) return null;

    const workout = await prisma.workout.create({
      data: {
        userId,
        startTime: new Date(),
        sourceTemplateId: templateId,
      },
    });

    return { workout, template };
  },
};

export default workoutService;
