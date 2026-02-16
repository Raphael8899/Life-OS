import { differenceInMinutes, subDays } from "date-fns";
import { DashboardCharts } from "@/components/DashboardCharts";
import { dayScore, levelFromXp, nextLevelXp, predictedGoalDate, projection, rollingAverage, streaks, xpFromMinutes } from "@/lib/analytics";
import { getHabitsWithCompletions, getSessionsSince, getSettings, getWakeups } from "@/lib/data";
import { toDateKey } from "@/lib/time";

export default async function DashboardPage() {
  const [settings, sessions, wakeups, habitsData] = await Promise.all([getSettings(), getSessionsSince(90), getWakeups(90), getHabitsWithCompletions(90)]);
  const excluded = new Set<string>(JSON.parse(settings.excludedCategoryIds || "[]"));
  const minsByDay = new Map<string, number>();
  const minsByCategory = new Map<string, number>();

  sessions.forEach((s) => {
    if (!s.endTime || excluded.has(s.categoryId)) return;
    const m = differenceInMinutes(s.endTime, s.startTime);
    const d = toDateKey(s.startTime);
    minsByDay.set(d, (minsByDay.get(d) ?? 0) + m);
    minsByCategory.set(s.category.name, (minsByCategory.get(s.category.name) ?? 0) + m);
  });

  const days = Array.from({ length: 90 }, (_, i) => {
    const date = toDateKey(subDays(new Date(), 89 - i));
    return { date, minutes: minsByDay.get(date) ?? 0 };
  });
  const avg7 = rollingAverage(days, 7);
  const avg30 = rollingAverage(days, 30);
  const trend = days.map((d, i) => ({ ...d, avg7: avg7[i].minutes, avg30: avg30[i].minutes }));

  const todayKey = toDateKey(new Date());
  const weekMinutes = days.slice(-7).reduce((a, b) => a + b.minutes, 0);
  const monthMinutes = days.slice(-30).reduce((a, b) => a + b.minutes, 0);
  const totalMinutes = days.reduce((a, b) => a + b.minutes, 0);
  const todayMinutes = minsByDay.get(todayKey) ?? 0;

  const dailyAvg = days.slice(-settings.projectionWindowDays).reduce((a, b) => a + b.minutes, 0) / settings.projectionWindowDays;
  const p1 = projection(days, settings.projectionWindowDays, 30);
  const p2 = projection(days, settings.projectionWindowDays, 60);
  const p3 = projection(days, settings.projectionWindowDays, 90);
  const goalDate = predictedGoalDate(totalMinutes, settings.goalHours, dailyAvg);

  const xp = xpFromMinutes(totalMinutes, settings.xpPer10Min);
  const lvl = levelFromXp(xp);
  const next = nextLevelXp(lvl);
  const streak = streaks(days, settings.lockedInMinThreshold);

  const wakeByDay = new Map(wakeups.map((w) => [w.date, w.wakeUpAt]));
  const wakeTrend = days.map((d) => {
    const dt = wakeByDay.get(d.date);
    return { date: d.date, minutes: dt ? dt.getHours() * 60 + dt.getMinutes() : null };
  });
  const scatter = days.map((d) => ({ wake: wakeTrend.find((x) => x.date === d.date)?.minutes ?? 0, locked: d.minutes }));
  const wake7 = wakeTrend.slice(-7).filter((x) => x.minutes !== null) as { date: string; minutes: number }[];
  const wake30 = wakeTrend.slice(-30).filter((x) => x.minutes !== null) as { date: string; minutes: number }[];
  const wake7Avg = wake7.length ? wake7.reduce((a,b)=>a+b.minutes,0)/wake7.length : 0;
  const wake30Avg = wake30.length ? wake30.reduce((a,b)=>a+b.minutes,0)/wake30.length : 0;


  const habitsByDay = new Map<string, number>();
  habitsData.completions.forEach((c) => {
    if (!habitsByDay.has(c.date)) habitsByDay.set(c.date, 0);
    if (c.completed) habitsByDay.set(c.date, (habitsByDay.get(c.date) ?? 0) + 1);
  });
  const heatHabits = days.map((d) => ({ date: d.date, value: habitsData.habits.length ? (habitsByDay.get(d.date) ?? 0) / habitsData.habits.length : 0 }));

  const todayWake = wakeByDay.get(todayKey);
  const dayHabitsRatio = heatHabits.find((x) => x.date === todayKey)?.value ?? 0;
  const score = dayScore({ lockedInMinutes: todayMinutes, wakeUpMinutesFromMidnight: todayWake ? todayWake.getHours() * 60 + todayWake.getMinutes() : undefined, habitRatio: dayHabitsRatio });

  const breakdown = Array.from(minsByCategory.entries()).map(([name, m]) => ({ name, hours: +(m / 60).toFixed(2) }));

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="card"><div className="text-zinc-400 text-sm">Today</div><div className="text-2xl font-bold">{(todayMinutes / 60).toFixed(1)}h</div></div>
        <div className="card"><div className="text-zinc-400 text-sm">This Week</div><div className="text-2xl font-bold">{(weekMinutes / 60).toFixed(1)}h</div></div>
        <div className="card"><div className="text-zinc-400 text-sm">This Month</div><div className="text-2xl font-bold">{(monthMinutes / 60).toFixed(1)}h</div></div>
        <div className="card"><div className="text-zinc-400 text-sm">Day Score</div><div className="text-2xl font-bold">{score}/100</div></div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        <div className="card xl:col-span-2">
          <h3 className="font-semibold">Daily summary card</h3>
          <p>Today {Math.round(todayMinutes / 60)}h vs 7-day avg {(((avg7[avg7.length - 1]?.minutes ?? 0) / 60)).toFixed(1)}h.</p>
          <p>Projection: 1m {(p1 / 60).toFixed(1)}h · 2m {(p2 / 60).toFixed(1)}h · 3m {(p3 / 60).toFixed(1)}h</p>
        </div>
        <div className="card">
          <h3 className="font-semibold">Level as AI Engineer</h3>
          <p>Level {lvl} · XP {xp.toFixed(0)} / {next}</p>
          <p>Goal {settings.goalHours}h ({((totalMinutes / 60 / settings.goalHours) * 100).toFixed(1)}%)</p>
          <p>Predicted completion: {goalDate ? goalDate.toISOString().slice(0, 10) : "Need more data"}</p>
          <p>Streak: {streak.current} days · Longest {streak.longest}</p>
          <p>Wake avg 7/30: {(wake7Avg/60).toFixed(2)}h / {(wake30Avg/60).toFixed(2)}h</p>
        </div>
      </div>
      <DashboardCharts trend={trend} breakdown={breakdown} wakeTrend={wakeTrend.filter((x) => x.minutes !== null)} scatter={scatter} heatLocked={days.map((d) => ({ date: d.date, value: d.minutes }))} heatHabits={heatHabits} />
    </div>
  );
}
