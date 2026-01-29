# Workout Logger Telegram Bot

Telegram Bot for tracking user's gym progression.

## Tech Stack

- Node.js + TypeScript
- [grammy](https://grammy.dev/) — Telegram Bot Framework
- Postgresql
- Prisma
- Redis

## Installation

1. Clone the repository

```bash
git clone https://github.com/ElOleksii/workouts-log-bot
cd workout-log-bot
```

2. Install dependencies

```bash
npm install
```

3. Create file .env in the root and pass the bot's token

```
BOT_TOKEN=your_bot_token
DATABASE_URL=your_db_url
REDIS_URL=your_redis_url
```

4. Create a migration to set up the database tables

```bash
npx prisma migrate dev --name init
```

5. Run the following command to generate the Prisma Client

```bash
npx prisma generate
```

6. Run code in dev mode

```bash
npm run dev
```

7. You can also build the code using

```bash
npm build
```
