"use client";

import { useTransition } from "react";
import { setHabitCompletion } from "@/actions";

export function HabitsBoard({ habits, completions, days }: any) {
  const [pending, start] = useTransition();
  const map = new Map(completions.map((c: any) => [`${c.habitId}:${c.date}`, c.completed]));
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead><tr><th className="text-left p-2">Habit</th>{days.map((d: string) => <th key={d} className="p-1">{d.slice(5)}</th>)}</tr></thead>
        <tbody>
          {habits.map((h: any) => (
            <tr key={h.id}><td className="p-2">{h.name}</td>{days.map((d: string) => <td key={d} className="text-center"><input disabled={pending} type="checkbox" checked={map.get(`${h.id}:${d}`) ?? false} onChange={(e) => start(() => setHabitCompletion({ habitId: h.id, date: d, completed: e.target.checked }))} /></td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
