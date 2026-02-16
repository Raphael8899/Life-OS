import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.habitCompletion.deleteMany();
  await prisma.habit.deleteMany();
  await prisma.activitySession.deleteMany();
  await prisma.category.deleteMany();
  await prisma.wakeUpEntry.deleteMany();

  await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      projectionWindowDays: 14,
      xpPer10Min: 1,
      lockedInMinThreshold: 60,
      goalHours: 1000,
      goalDeadline: new Date(new Date().setMonth(new Date().getMonth() + 8)),
      excludedCategoryIds: "[]",
    },
  });

  const coding = await prisma.category.create({ data: { name: "Coding" } });
  const ai = await prisma.category.create({ data: { name: "AI Engineering", parentId: coding.id } });
  const dsa = await prisma.category.create({ data: { name: "DSA", parentId: coding.id } });
  const deep = await prisma.category.create({ data: { name: "Deep Work" } });

  const now = new Date();
  for (let i = 0; i < 20; i++) {
    const day = new Date(now);
    day.setDate(day.getDate() - i);
    day.setHours(6 + (i % 3), 15 + (i % 20), 0, 0);
    await prisma.wakeUpEntry.upsert({
      where: { date: day.toISOString().slice(0, 10) },
      update: { wakeUpAt: day },
      create: { date: day.toISOString().slice(0, 10), wakeUpAt: day },
    });

    const s1Start = new Date(day);
    s1Start.setHours(9, 0, 0, 0);
    const s1End = new Date(s1Start);
    s1End.setMinutes(s1End.getMinutes() + 90 + (i % 4) * 20);
    await prisma.activitySession.create({ data: { categoryId: ai.id, startTime: s1Start, endTime: s1End } });

    const s2Start = new Date(day);
    s2Start.setHours(14, 0, 0, 0);
    const s2End = new Date(s2Start);
    s2End.setMinutes(s2End.getMinutes() + 60 + (i % 2) * 30);
    await prisma.activitySession.create({ data: { categoryId: i % 2 ? dsa.id : deep.id, startTime: s2Start, endTime: s2End } });
  }

  const habits = await prisma.$transaction([
    prisma.habit.create({ data: { name: "No phone first hour" } }),
    prisma.habit.create({ data: { name: "Ship one tiny feature" } }),
    prisma.habit.create({ data: { name: "Read docs", targetLabel: "15+ mins" } }),
  ]);

  for (const habit of habits) {
    for (let i = 0; i < 20; i++) {
      const day = new Date(now);
      day.setDate(day.getDate() - i);
      await prisma.habitCompletion.upsert({
        where: { habitId_date: { habitId: habit.id, date: day.toISOString().slice(0, 10) } },
        update: { completed: (i + habit.name.length) % 3 !== 0 },
        create: { habitId: habit.id, date: day.toISOString().slice(0, 10), completed: (i + habit.name.length) % 3 !== 0 },
      });
    }
  }
}

main().finally(async () => prisma.$disconnect());
