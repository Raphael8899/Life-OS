export function Heatmap({ values, max = 240 }: { values: { date: string; value: number }[]; max?: number }) {
  return (
    <div className="grid grid-cols-15 gap-1">
      {values.map((v) => {
        const intensity = Math.min(1, v.value / max);
        const bg = `rgba(20,184,166,${0.15 + intensity * 0.85})`;
        return <div key={v.date} title={`${v.date}: ${v.value.toFixed(0)}`} className="w-4 h-4 rounded-sm" style={{ background: bg }} />;
      })}
    </div>
  );
}
