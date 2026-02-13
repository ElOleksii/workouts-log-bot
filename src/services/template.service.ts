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
  async updateTemplate(
    templateId: number,
    name: string,
    exercises: TemplateDraftExercise[],
  ) {
    await prisma.template.update({
      where: {
        id: templateId,
      },
      data: { name },
    });

    await prisma.templateExercise.deleteMany({
      where: { templateId },
    });

    for (const ex of exercises) {
      await prisma.templateExercise.create({
        data: {
          templateId,
          name: ex.name,
          sets: {
            create: ex.sets.map((set) => ({
              weight: set.weight,
              reps: set.reps,
            })),
          },
        },
      });
    }
  },
  async deleteTemplate(templateId: number) {
    await prisma.template.delete({
      where: {
        id: templateId,
      },
    });
  },
  async findAllTemplates(userId: number) {
    return prisma.template.findMany({
      where: {
        userId,
      },
      include: {
        exercises: {
          include: {
            sets: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },
  async findTemplateById(templateId: number) {
    return prisma.template.findUnique({
      where: {
        id: templateId,
      },
      include: {
        exercises: {
          include: {
            sets: true,
          },
        },
      },
    });
  },
};
