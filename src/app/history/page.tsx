import { deleteSession, updateSession } from "@/actions";
import { prisma } from "@/lib/prisma";

export default async function HistoryPage({ searchParams }: { searchParams: Promise<{ from?: string; to?: string; categoryId?: string; minDuration?: string }> }) {
  const q = await searchParams;
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const sessions = await prisma.activitySession.findMany({
    where: {
      categoryId: q.categoryId || undefined,
      startTime: q.from ? { gte: new Date(`${q.from}T00:00:00`) } : undefined,
      endTime: q.to ? { lte: new Date(`${q.to}T23:59:59`) } : { not: null },
    },
    include: { category: true },
    orderBy: { startTime: "desc" },
    take: 200,
  });
  const minDur = Number(q.minDuration ?? 0);
  const filtered = sessions.filter((s) => s.endTime && ((s.endTime.getTime() - s.startTime.getTime()) / 60000 >= minDur));

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">History</h2>
      <form className="card flex flex-wrap gap-2">
        <input type="date" name="from" defaultValue={q.from} />
        <input type="date" name="to" defaultValue={q.to} />
        <select name="categoryId" defaultValue={q.categoryId}><option value="">All categories</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <input type="number" name="minDuration" placeholder="Min mins" defaultValue={q.minDuration} />
        <button type="submit">Apply</button>
      </form>
      <div className="space-y-2">
        {filtered.map((s) => (
          <form key={s.id} action={async (fd) => { "use server"; await updateSession(s.id, { startTime: String(fd.get("startTime")), endTime: String(fd.get("endTime")), notes: String(fd.get("notes")) }); }} className="card grid grid-cols-1 md:grid-cols-6 gap-2 items-center text-sm">
            <span>{s.category.name}</span>
            <input name="startTime" type="datetime-local" defaultValue={s.startTime.toISOString().slice(0, 16)} />
            <input name="endTime" type="datetime-local" defaultValue={s.endTime?.toISOString().slice(0, 16)} />
            <input name="notes" defaultValue={s.notes ?? ""} placeholder="Notes" />
            <button type="submit">Save</button>
            <button formAction={async () => { "use server"; await deleteSession(s.id); }}>Delete</button>
          </form>
        ))}
      </div>
    </div>
  );
}
