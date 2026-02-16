import { formatInTimeZone, fromZonedTime } from "date-fns-tz";

export const APP_TZ = "Europe/Vienna";

export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h}h ${m}m`;
}

export function toDateKey(date: Date) {
  return formatInTimeZone(date, APP_TZ, "yyyy-MM-dd");
}

export function parseDateTimeInTz(dateKey: string, timeHHMM: string) {
  return fromZonedTime(`${dateKey}T${timeHHMM}:00`, APP_TZ);
}

export function minutesBetween(start: Date, end?: Date | null) {
  if (!end) return 0;
  return Math.max(0, (end.getTime() - start.getTime()) / 60000);
}
