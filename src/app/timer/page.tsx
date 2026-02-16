import { differenceInMinutes } from "date-fns";
import { TimerPanel } from "@/components/TimerPanel";
import { upsertWakeUp } from "@/actions";
import { toDateKey } from "@/lib/time";
import { getCategories, getRunningSession, getTodaySessions } from "@/lib/data";

export default async function TimerPage() {
  const [categories, runningSession, today] = await Promise.all([getCategories(), getRunningSession(), getTodaySessions()]);

  const freq = new Map<string, number>();
  today.forEach((s) => freq.set(s.categoryId, (freq.get(s.categoryId) ?? 0) + 1));
  const quick = categories
    .sort((a, b) => (freq.get(b.id) ?? 0) - (freq.get(a.id) ?? 0))
    .slice(0, 5)
    .map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Timer</h2>
      <TimerPanel categories={categories} runningSession={runningSession} quickCategories={quick} />
      <form className="card flex items-center gap-2" action={async (fd) => { "use server"; const date=String(fd.get("date")); const time=String(fd.get("time")); await upsertWakeUp({ date, wakeUpAtISO: new Date(`${date}T${time}:00`).toISOString() }); }}>
        <span>Wake-up entry</span>
        <input type="date" name="date" defaultValue={toDateKey(new Date())} />
        <input type="time" name="time" defaultValue="06:30" />
        <button type="submit">Save</button>
      </form>
      <div className="card">
        <h3 className="font-semibold mb-2">Today sessions</h3>
        <ul className="space-y-2 text-sm">
          {today.map((s) => <li key={s.id}>{s.category.name}: {new Date(s.startTime).toLocaleTimeString()} - {s.endTime ? new Date(s.endTime).toLocaleTimeString() : "running"} ({s.endTime ? `${differenceInMinutes(s.endTime, s.startTime)}m` : "..."})</li>)}
        </ul>
      </div>
    </div>
  );
}
