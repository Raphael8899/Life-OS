import { format } from "date-fns";
import { LockInMode } from "@/components/LockInMode";
import { getRunningSession, getTodaySessions } from "@/lib/data";

export default async function LockInPage() {
  const [running, sessions] = await Promise.all([getRunningSession(), getTodaySessions()]);
  const series = sessions
    .filter((s) => s.endTime)
    .map((s) => ({ time: format(new Date(s.startTime), "HH:mm"), minutes: (new Date(s.endTime!).getTime() - new Date(s.startTime).getTime()) / 60000 }));
  return <LockInMode runningStart={running?.startTime.toISOString()} todaySeries={series} />;
}
