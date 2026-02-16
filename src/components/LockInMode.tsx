"use client";

import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function LockInMode({ runningStart, todaySeries }: { runningStart?: string; todaySeries: { time: string; minutes: number }[] }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const elapsed = useMemo(() => runningStart ? Math.floor((now - new Date(runningStart).getTime()) / 1000) : 0, [now, runningStart]);
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-8">
      <div className="text-zinc-400 uppercase tracking-widest">Lock-in Mode</div>
      <div className="text-8xl font-black">{runningStart ? `${mm}:${ss}` : "00:00"}</div>
      <div className="card w-full max-w-3xl h-72"><ResponsiveContainer width="100%" height="100%"><AreaChart data={todaySeries}><XAxis dataKey="time"/><YAxis/><Tooltip/><Area dataKey="minutes" fill="#14b8a6" stroke="#14b8a6"/></AreaChart></ResponsiveContainer></div>
    </div>
  );
}
