import { prisma } from "../prisma.js";

export const statsService = {
  async getWorkoutsByDateInput(userId: number, inputDateString: string) {
    let targetDate: Date;

    if (inputDateString) {
      const parsedDate = this.parseDate(inputDateString);
      if (!parsedDate) {
        return null;
      }
      targetDate = parsedDate;
    } else {
      const lastWorkout = await prisma.workout.findFirst({
        where: {
          userId,
          isFinished: true,
        },
        orderBy: {
          startTime: "desc",
        },
      });

      if (!lastWorkout || !lastWorkout.startTime) {
        return null;
      }

      targetDate = new Date(lastWorkout.startTime);
    }

    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 0);

    const workouts = await prisma.workout.findMany({
      where: {
        userId: userId,
        startTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
        isFinished: true,
      },
      include: {
        exercises: {
          include: {
            sets: true,
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return {
      date: targetDate,
      workouts,
    };
  },

  parseDate(input: string): Date | null {
    const dateRegex = /^(\d{1,2})([.\s])(\d{1,2})(?:\2(\d{2}|\d{4}))?$/;

    const match = input.match(dateRegex);

    if (!match) return null;

    let day = parseInt(match[1]!);
    let month = parseInt(match[3]!);
    let year: number;

    if (month > 12 && day <= 12) {
      const temp = day;
      day = month;
      month = temp;
    }

    if (month < 1 || month > 12) return null;

    if (day < 1 || day > 31) return null;

    if (match[4]) {
      year =
        match[4].length === 2 ? 2000 + parseInt(match[4]) : parseInt(match[4]);
    } else {
      year = new Date().getFullYear();
    }

    return new Date(year, month - 1, day);
  },
};
