import { subDays } from "date-fns";
import { createHabit, deleteHabit } from "@/actions";
import { HabitsBoard } from "@/components/HabitsBoard";
import { getHabitsWithCompletions } from "@/lib/data";
import { toDateKey } from "@/lib/time";

export default async function HabitsPage() {
  const { habits, completions } = await getHabitsWithCompletions(30);
  const days = Array.from({ length: 14 }, (_, i) => toDateKey(subDays(new Date(), 13 - i)));

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Habits</h2>
      <form action={async (fd) => { "use server"; await createHabit({ name: fd.get("name"), targetLabel: fd.get("targetLabel") }); }} className="card flex gap-2">
        <input name="name" placeholder="Habit name" required />
        <input name="targetLabel" placeholder="Optional target" />
        <button type="submit">Create</button>
      </form>
      <div className="card"><HabitsBoard habits={habits} completions={completions} days={days} /></div>
      <div className="space-y-2">
        {habits.map((h) => <form key={h.id} className="card" action={async () => { "use server"; await deleteHabit(h.id); }}><span>{h.name}</span> <button className="ml-3">Delete</button></form>)}
      </div>
    </div>
  );
}
