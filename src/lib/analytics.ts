import { addDays } from "date-fns";
import { DailyMinutes } from "@/lib/types";

export function rollingAverage(data: DailyMinutes[], windowDays: number) {
  const out: DailyMinutes[] = [];
  for (let i = 0; i < data.length; i++) {
    const slice = data.slice(Math.max(0, i - windowDays + 1), i + 1);
    out.push({
      date: data[i].date,
      minutes: slice.reduce((acc, x) => acc + x.minutes, 0) / slice.length,
    });
  }
  return out;
}

export function projection(data: DailyMinutes[], lookbackDays: number, futureDays: number) {
  const recent = data.slice(-lookbackDays);
  const avg = recent.length ? recent.reduce((a, b) => a + b.minutes, 0) / recent.length : 0;
  return avg * futureDays;
}

export function xpFromMinutes(minutes: number, xpPer10Min: number) {
  return (minutes / 10) * xpPer10Min;
}

export function levelFromXp(totalXp: number) {
  return Math.floor(Math.sqrt(totalXp / 100));
}

export function nextLevelXp(level: number) {
  return (level + 1) * (level + 1) * 100;
}

export function streaks(data: DailyMinutes[], thresholdMin: number) {
  let current = 0;
  let longest = 0;
  for (const day of data) {
    if (day.minutes >= thresholdMin) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }
  return { current, longest };
}

export function dayScore({ lockedInMinutes, wakeUpMinutesFromMidnight, habitRatio }: { lockedInMinutes: number; wakeUpMinutesFromMidnight?: number; habitRatio: number; }) {
  const lock = Math.min(50, (lockedInMinutes / 240) * 50);
  const wake = wakeUpMinutesFromMidnight == null ? 15 : Math.max(0, Math.min(25, ((9 * 60 - wakeUpMinutesFromMidnight) / 180) * 25));
  const habits = Math.max(0, Math.min(25, habitRatio * 25));
  return Math.round(lock + wake + habits);
}

export function predictedGoalDate(totalMinutes: number, goalHours: number, avgDailyMinutes: number, today = new Date()) {
  const remaining = goalHours * 60 - totalMinutes;
  if (remaining <= 0) return today;
  if (avgDailyMinutes <= 0) return null;
  const daysNeeded = Math.ceil(remaining / avgDailyMinutes);
  return addDays(today, daysNeeded);
}
