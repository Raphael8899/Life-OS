"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { CommandPalette } from "@/components/CommandPalette";
import { CategoryTreePicker } from "@/components/CategoryTreePicker";
import { startSession, stopSession } from "@/actions";

export function TimerPanel({ categories, runningSession, quickCategories }: any) {
  const [selected, setSelected] = useState<string>(quickCategories[0]?.id ?? "");
  const [pending, startT] = useTransition();
  const [index, setIndex] = useState(0);
  const quick = useMemo(() => quickCategories as { id: string; name: string }[], [quickCategories]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        startT(async () => {
          if (runningSession) await stopSession({ sessionId: runningSession.id });
          else if (selected) await startSession({ categoryId: selected });
        });
      }
      if (e.key === "ArrowDown") {
        setIndex((i) => (i + 1) % Math.max(1, quick.length));
        if (quick.length) setSelected(quick[(index + 1) % quick.length].id);
      }
      if (e.key === "ArrowUp") {
        const ni = (index - 1 + quick.length) % quick.length;
        setIndex(ni);
        if (quick.length) setSelected(quick[ni].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [runningSession, selected, quick, index]);

  return (
    <div className="space-y-4">
      <div className="card">
        <h3 className="text-xl font-bold">Current</h3>
        <p>{runningSession ? `${runningSession.category.name} running...` : "No running activity"}</p>
        <div className="mt-3 flex gap-2 items-center">
          <CategoryTreePicker categories={categories} value={selected} onChange={setSelected} />
          <button className="px-5 py-2 bg-accent text-black font-semibold rounded" disabled={pending || (!runningSession && !selected)} onClick={() => startT(async () => runningSession ? stopSession({ sessionId: runningSession.id }) : startSession({ categoryId: selected }))}>{runningSession ? "Stop" : "Start"}</button>
        </div>
      </div>
      <div className="card">
        <div className="font-semibold mb-2">Quick switch</div>
        <div className="flex flex-wrap gap-2">{quick.map((c) => <button key={c.id} onClick={() => startT(async () => startSession({ categoryId: c.id }))}>{c.name}</button>)}</div>
      </div>
      <CommandPalette categories={categories} onPick={(id) => startT(async () => startSession({ categoryId: id }))} />
    </div>
  );
}
