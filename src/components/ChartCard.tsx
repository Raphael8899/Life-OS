import { ReactNode } from "react";

export function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="card">
      <h3 className="font-semibold mb-3">{title}</h3>
      <div className="h-64">{children}</div>
    </div>
  );
}
