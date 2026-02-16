# LifeOS

LifeOS is a chart-first personal operating system web app built with **Next.js + Prisma + SQLite**.

## Features
- Single running activity timer (auto-stop on switch)
- Categories with unlimited nesting
- Manual wake-up tracker (one editable entry per day)
- Habit tracking with daily checkboxes
- Rich analytics dashboard:
  - Daily/weekly/monthly locked-in totals
  - 7/30 day rolling averages
  - 1/2/3 month projections
  - Goal progress and predicted completion date
  - XP + level system
  - Streak metrics
  - Category bar + donut breakdown
  - Wake-up trend + wake/locked-in scatter
  - Heatmaps for locked-in time and habits
- Floating "Now Running" widget
- Full-screen Lock-in mode
- Keyboard shortcuts:
  - `Space`: start/stop timer
  - `Ctrl+K`: category command palette
  - `ArrowUp/ArrowDown`: cycle quick categories

## Tech Stack
- Next.js App Router + TypeScript
- TailwindCSS
- Prisma + SQLite
- Recharts
- Zod
- Vitest (analytics unit tests)

## Setup
```bash
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run db:seed
npm run dev
```

Open http://localhost:3000.

## Database scripts
```bash
npm run db:seed
npm run db:reset
```

## Project structure
- `src/app/*`: App Router pages (`dashboard`, `timer`, `categories`, `habits`, `history`, `settings`, `lock-in`)
- `src/actions/index.ts`: server actions (CRUD + timer logic)
- `src/lib/analytics.ts`: analytics computations
- `src/lib/data.ts`: dashboard/timer data selectors
- `prisma/schema.prisma`: DB model
- `prisma/seed.ts`: demo seed data

## Time zone handling
- App assumes `Europe/Vienna` for display/date bucketing.
- Timestamps are persisted as ISO datetimes in SQLite.
