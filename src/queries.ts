import { prisma } from "./prisma";

export const calculateWorkoutTime = async (workoutId: number) => {
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
};
