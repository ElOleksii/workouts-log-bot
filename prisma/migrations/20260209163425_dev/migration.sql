-- CreateTable
CREATE TABLE "workouts" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "is_finished" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercises" (
    "id" SERIAL NOT NULL,
    "workout_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sets" (
    "id" SERIAL NOT NULL,
    "exercise_id" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,

    CONSTRAINT "sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "templates" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "template_exercises" (
    "id" SERIAL NOT NULL,
    "template_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "template_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "template_sets" (
    "id" SERIAL NOT NULL,
    "template_exercise_id" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,

    CONSTRAINT "template_sets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "workouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sets" ADD CONSTRAINT "sets_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_exercises" ADD CONSTRAINT "template_exercises_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_sets" ADD CONSTRAINT "template_sets_template_exercise_id_fkey" FOREIGN KEY ("template_exercise_id") REFERENCES "template_exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;
