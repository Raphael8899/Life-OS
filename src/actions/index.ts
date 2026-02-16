"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { toDateKey } from "@/lib/time";

const categorySchema = z.object({ name: z.string().min(1), parentId: z.string().nullable().optional() });
const sessionStartSchema = z.object({ categoryId: z.string().min(1), notes: z.string().optional() });
const sessionStopSchema = z.object({ sessionId: z.string().min(1) });
const wakeSchema = z.object({ date: z.string().min(10), wakeUpAtISO: z.string().datetime() });
const habitSchema = z.object({ name: z.string().min(1), targetLabel: z.string().optional() });
const habitCompleteSchema = z.object({ habitId: z.string(), date: z.string(), completed: z.boolean() });
const settingsSchema = z.object({ projectionWindowDays: z.coerce.number().int().min(1).max(90), xpPer10Min: z.coerce.number().int().min(1).max(20), lockedInMinThreshold: z.coerce.number().int().min(1).max(300), goalHours: z.coerce.number().int().min(1).max(100000), goalDeadline: z.string().optional(), excludedCategoryIds: z.array(z.string()) });

export async function createCategory(input: unknown) {
  const data = categorySchema.parse(input);
  await prisma.category.create({ data: { name: data.name, parentId: data.parentId ?? null } });
  revalidatePath("/categories");
}

export async function updateCategory(id: string, input: unknown) {
  const data = categorySchema.parse(input);
  await prisma.category.update({ where: { id }, data: { name: data.name, parentId: data.parentId ?? null } });
  revalidatePath("/categories");
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({ where: { id } });
  revalidatePath("/categories");
}

export async function startSession(input: unknown) {
  const data = sessionStartSchema.parse(input);
  const active = await prisma.activitySession.findFirst({ where: { endTime: null }, orderBy: { startTime: "desc" } });
  const now = new Date();
  if (active) {
    await prisma.activitySession.update({ where: { id: active.id }, data: { endTime: now } });
  }
  await prisma.activitySession.create({ data: { categoryId: data.categoryId, startTime: now, notes: data.notes } });
  revalidatePath("/timer");
  revalidatePath("/dashboard");
}

export async function stopSession(input: unknown) {
  const data = sessionStopSchema.parse(input);
  await prisma.activitySession.update({ where: { id: data.sessionId }, data: { endTime: new Date() } });
  revalidatePath("/timer");
  revalidatePath("/dashboard");
}

export async function upsertWakeUp(input: unknown) {
  const data = wakeSchema.parse(input);
  await prisma.wakeUpEntry.upsert({ where: { date: data.date }, update: { wakeUpAt: new Date(data.wakeUpAtISO) }, create: { date: data.date, wakeUpAt: new Date(data.wakeUpAtISO) } });
  revalidatePath("/dashboard");
}

export async function createHabit(input: unknown) {
  const data = habitSchema.parse(input);
  await prisma.habit.create({ data });
  revalidatePath("/habits");
}

export async function deleteHabit(id: string) {
  await prisma.habit.delete({ where: { id } });
  revalidatePath("/habits");
}

export async function setHabitCompletion(input: unknown) {
  const data = habitCompleteSchema.parse(input);
  await prisma.habitCompletion.upsert({ where: { habitId_date: { habitId: data.habitId, date: data.date } }, update: { completed: data.completed }, create: data });
  revalidatePath("/habits");
  revalidatePath("/dashboard");
}

export async function upsertSettings(input: unknown) {
  const data = settingsSchema.parse(input);
  await prisma.settings.upsert({
    where: { id: 1 },
    update: { ...data, goalDeadline: data.goalDeadline ? new Date(data.goalDeadline) : null, excludedCategoryIds: JSON.stringify(data.excludedCategoryIds) },
    create: { id: 1, ...data, goalDeadline: data.goalDeadline ? new Date(data.goalDeadline) : null, excludedCategoryIds: JSON.stringify(data.excludedCategoryIds) },
  });
  revalidatePath("/settings");
  revalidatePath("/dashboard");
}

export async function deleteSession(id: string) {
  await prisma.activitySession.delete({ where: { id } });
  revalidatePath("/history");
  revalidatePath("/timer");
}

export async function updateSession(id: string, input: { startTime: string; endTime?: string; notes?: string }) {
  await prisma.activitySession.update({ where: { id }, data: { startTime: new Date(input.startTime), endTime: input.endTime ? new Date(input.endTime) : null, notes: input.notes } });
  revalidatePath("/history");
  revalidatePath("/dashboard");
}

export async function ensureTodayHabitRows(habitId: string) {
  const date = toDateKey(new Date());
  await prisma.habitCompletion.upsert({ where: { habitId_date: { habitId, date } }, update: {}, create: { habitId, date, completed: false } });
}
