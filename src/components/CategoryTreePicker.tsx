"use client";

import { useMemo } from "react";

type Cat = { id: string; name: string; parentId: string | null };

export function CategoryTreePicker({ categories, value, onChange }: { categories: Cat[]; value?: string; onChange: (id: string) => void }) {
  const options = useMemo(() => {
    const byParent = new Map<string | null, Cat[]>();
    categories.forEach((c) => byParent.set(c.parentId, [...(byParent.get(c.parentId) ?? []), c]));
    const out: { id: string; label: string }[] = [];
    const dfs = (pid: string | null, depth: number) => {
      (byParent.get(pid) ?? []).forEach((c) => {
        out.push({ id: c.id, label: `${"—".repeat(depth)} ${c.name}`.trim() });
        dfs(c.id, depth + 1);
      });
    };
    dfs(null, 0);
    return out;
  }, [categories]);

  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Select category</option>
      {options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
    </select>
  );
}
