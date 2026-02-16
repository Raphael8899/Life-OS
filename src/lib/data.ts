import { endOfDay, startOfDay, subDays } from "date-fns";
import { prisma } from "@/lib/prisma";
import { toDateKey } from "@/lib/time";

export async function getSettings() {
  return prisma.settings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function getRunningSession() {
  return prisma.activitySession.findFirst({ where: { endTime: null }, include: { category: true }, orderBy: { startTime: "desc" } });
}

export async function getSessionsSince(days: number) {
  const start = startOfDay(subDays(new Date(), days - 1));
  return prisma.activitySession.findMany({ where: { startTime: { gte: start }, endTime: { not: null } }, include: { category: true }, orderBy: { startTime: "asc" } });
}

export async function getTodaySessions() {
  const now = new Date();
  return prisma.activitySession.findMany({ where: { startTime: { gte: startOfDay(now), lte: endOfDay(now) } }, include: { category: true }, orderBy: { startTime: "desc" } });
}

export async function getWakeups(days = 60) {
  return prisma.wakeUpEntry.findMany({ where: { date: { gte: toDateKey(subDays(new Date(), days)) } }, orderBy: { date: "asc" } });
}

export async function getHabitsWithCompletions(days = 30) {
  const habits = await prisma.habit.findMany({ orderBy: { createdAt: "asc" } });
  const completions = await prisma.habitCompletion.findMany({ where: { date: { gte: toDateKey(subDays(new Date(), days - 1)) } } });
  return { habits, completions };
}
