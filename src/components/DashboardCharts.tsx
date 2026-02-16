"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "@/components/ChartCard";
import { Heatmap } from "@/components/Heatmap";

export function DashboardCharts({ trend, breakdown, wakeTrend, scatter, heatLocked, heatHabits }: any) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <ChartCard title="Locked-in trend (7 / 30 day rolling)">
        <ResponsiveContainer width="100%" height="100%"><LineChart data={trend}><CartesianGrid stroke="#333"/><XAxis dataKey="date" hide/><YAxis/><Tooltip/><Line dataKey="minutes" stroke="#14b8a6"/><Line dataKey="avg7" stroke="#60a5fa"/><Line dataKey="avg30" stroke="#a78bfa"/></LineChart></ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Category breakdown (bar)">
        <ResponsiveContainer width="100%" height="100%"><BarChart data={breakdown}><CartesianGrid stroke="#333"/><XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="hours" fill="#14b8a6"/></BarChart></ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Category share (donut)">
        <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={breakdown} dataKey="hours" nameKey="name" innerRadius={50} outerRadius={90} fill="#14b8a6" label /></PieChart></ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Wake-up trend">
        <ResponsiveContainer width="100%" height="100%"><LineChart data={wakeTrend}><CartesianGrid stroke="#333"/><XAxis dataKey="date" hide/><YAxis/><Tooltip/><Line dataKey="minutes" stroke="#f59e0b"/></LineChart></ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Earlier wake-up vs locked-in (scatter)">
        <ResponsiveContainer width="100%" height="100%"><ScatterChart><CartesianGrid stroke="#333"/><XAxis type="number" dataKey="wake" name="Wake (min)"/><YAxis type="number" dataKey="locked" name="Locked"/><Tooltip cursor={{ strokeDasharray: "3 3" }} /><Scatter data={scatter} fill="#14b8a6"/></ScatterChart></ResponsiveContainer>
      </ChartCard>
      <div className="card space-y-4"><h3 className="font-semibold">Heatmaps</h3><div><div className="text-sm mb-2">Locked-in</div><Heatmap values={heatLocked}/></div><div><div className="text-sm mb-2">Habits</div><Heatmap values={heatHabits} max={1}/></div></div>
    </div>
  );
}
