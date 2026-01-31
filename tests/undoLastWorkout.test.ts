import workoutService from "../api/src/services/workout.service";
import { prisma } from "../api/src/prisma.js";

jest.mock("../api/src/prisma", () => ({
  prisma: {
    set: {
      findMany: jest.fn(),
      delete: jest.fn(),
    },
    exercise: {
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe("workoutService.undoLastLog", () => {
  const EXERCISE_ID = 10;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should delete the last set and return SET_DELETED if sets exist", async () => {
    const mockSets = [
      { id: 100, weight: 80, reps: 10 },
      { id: 99, weight: 75, reps: 12 },
    ];
    (prisma.set.findMany as jest.Mock).mockResolvedValue(mockSets);
    (prisma.set.delete as jest.Mock).mockResolvedValue({});

    const result = await workoutService.undoLastLog(EXERCISE_ID);

    expect(prisma.set.delete).toHaveBeenCalledWith({
      where: { id: 100 },
    });
    expect(result).toEqual({
      type: "SET_DELETED",
      weight: 80,
      reps: 10,
    });
  });

  test("should delete exercise and return EXERCISE_DELETED if no sets exist", async () => {
    (prisma.set.findMany as jest.Mock).mockResolvedValue([]); // Сетів немає
    (prisma.exercise.findUnique as jest.Mock).mockResolvedValue({
      id: EXERCISE_ID,
      name: "Pull-ups",
    });
    (prisma.exercise.delete as jest.Mock).mockResolvedValue({});

    const result = await workoutService.undoLastLog(EXERCISE_ID);

    expect(prisma.exercise.delete).toHaveBeenCalledWith({
      where: { id: EXERCISE_ID },
    });
    expect(result).toEqual({
      type: "EXERCISE_DELETED",
      name: "Pull-ups",
    });
  });

  test("should return NOTHING_TO_DELETE if neither sets nor exercise exist", async () => {
    (prisma.set.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.exercise.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await workoutService.undoLastLog(EXERCISE_ID);

    expect(result).toEqual({ type: "NOTHING_TO_DELETE" });
    expect(prisma.set.delete).not.toHaveBeenCalled();
    expect(prisma.exercise.delete).not.toHaveBeenCalled();
  });
});
