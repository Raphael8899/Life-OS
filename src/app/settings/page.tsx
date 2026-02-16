import { upsertSettings } from "@/actions";
import { getCategories, getSettings } from "@/lib/data";

export default async function SettingsPage() {
  const [settings, categories] = await Promise.all([getSettings(), getCategories()]);
  const excluded = new Set<string>(JSON.parse(settings.excludedCategoryIds || "[]"));

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Settings</h2>
      <form className="card space-y-3" action={async (fd) => {
        "use server";
        const excludedCategoryIds = fd.getAll("excludedCategoryIds").map(String);
        await upsertSettings({
          projectionWindowDays: fd.get("projectionWindowDays"),
          xpPer10Min: fd.get("xpPer10Min"),
          lockedInMinThreshold: fd.get("lockedInMinThreshold"),
          goalHours: fd.get("goalHours"),
          goalDeadline: String(fd.get("goalDeadline") || ""),
          excludedCategoryIds,
        });
      }}>
        <label className="block">Projection window days <input name="projectionWindowDays" defaultValue={settings.projectionWindowDays} type="number" /></label>
        <label className="block">XP per 10 min <input name="xpPer10Min" defaultValue={settings.xpPer10Min} type="number" /></label>
        <label className="block">Locked-in threshold minutes <input name="lockedInMinThreshold" defaultValue={settings.lockedInMinThreshold} type="number" /></label>
        <label className="block">Goal hours <input name="goalHours" defaultValue={settings.goalHours} type="number" /></label>
        <label className="block">Goal deadline <input name="goalDeadline" defaultValue={settings.goalDeadline?.toISOString().slice(0,10)} type="date" /></label>
        <div>
          <div className="font-semibold mb-1">Exclude categories from locked-in:</div>
          {categories.map((c) => <label key={c.id} className="block"><input type="checkbox" name="excludedCategoryIds" value={c.id} defaultChecked={excluded.has(c.id)} /> {c.name}</label>)}
        </div>
        <button type="submit">Save settings</button>
      </form>
    </div>
  );
}
