# Workout Logger Telegram Bot

A Telegram bot for logging gym workouts, tracking progress, and reusing templates.

## Features

- Start, finish, cancel, and undo workout sessions.
- Log exercises and sets with simple text input.
- Create templates manually or from past workouts.
- Track history and fetch workouts by date.
- Redis-backed sessions for multi-step flows.

## Commands

- `/start` - overview and usage hints.
- `/new` - start a workout (with or without template).
- `/finish` - finish the active workout and save it.
- `/cancel` - cancel the active workout without saving.
- `/undo` - remove the last set, or the exercise if empty.
- `/find` - find workouts by date (e.g., `30.01.2026`, `30 01 2026`, `30.01.26`).
- `/get_workouts` - list recent workouts with pagination.
- `/new_template` - create a workout template.
- `/manage_templates` - edit or delete existing templates.

## Tech Stack

- Node.js + TypeScript
- grammy (Telegram Bot Framework)
- PostgreSQL + Prisma
- Redis (session storage)

## Requirements

- Node.js 18+
- PostgreSQL database
- Redis instance
- Telegram Bot token

## Setup

1. Clone the repository

```bash
git clone <your-repo-url>
cd gym-bot
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the project root

```bash
BOT_TOKEN=your_bot_token
DATABASE_URL=your_db_url
REDIS_URL=your_redis_url
```

4. Initialize the database

```bash
npx prisma migrate dev --name init
```

5. (Optional) Generate Prisma client manually

```bash
npx prisma generate
```

## Run Locally (Long Polling)

```bash
npm run dev
```

## Build and Run

```bash
npm run build
npm run start
```

## Webhook Mode (Production)

This project includes a Vercel-friendly webhook handler in `api/index.ts`.

1. Deploy the project.
2. Set the webhook URL:

```bash
npm run webhook https://your-deployment-url
```

3. Register bot commands:

```bash
npm run commands
```

## Scripts

- `npm run dev` - start the bot locally using long polling.
- `npm run build` - compile TypeScript to `build/`.
- `npm run start` - run the compiled webhook server.
- `npm run webhook <url>` - set Telegram webhook.
- `npm run commands` - register bot commands in Telegram.
- `npm run test` - run tests with Jest.

## Data Model (Overview)

- Workout has many Exercises.
- Exercise has many Sets.
- Template contains TemplateExercises and TemplateSets.

See `prisma/schema.prisma` for the full schema.
