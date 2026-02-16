"use client";

import { useEffect, useState } from "react";

export function CommandPalette({ categories, onPick }: { categories: { id: string; name: string }[]; onPick: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((x) => !x);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!open) return null;
  const filtered = categories.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-20 z-50" onClick={() => setOpen(false)}>
      <div className="card w-[500px]" onClick={(e) => e.stopPropagation()}>
        <input placeholder="Search category..." value={q} onChange={(e) => setQ(e.target.value)} className="w-full mb-3" />
        <div className="max-h-80 overflow-y-auto space-y-2">
          {filtered.map((c) => (
            <button key={c.id} className="w-full text-left hover:bg-zinc-800 p-2 rounded" onClick={() => { onPick(c.id); setOpen(false); }}>
              {c.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
