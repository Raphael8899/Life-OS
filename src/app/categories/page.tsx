import { createCategory, deleteCategory, updateCategory } from "@/actions";
import { getCategories } from "@/lib/data";

export default async function CategoriesPage() {
  const categories = await getCategories();
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Categories</h2>
      <form action={async (fd) => { "use server"; await createCategory({ name: fd.get("name"), parentId: fd.get("parentId") || null }); }} className="card flex gap-2 items-center">
        <input name="name" placeholder="New category" required />
        <select name="parentId"><option value="">No parent</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <button type="submit">Create</button>
      </form>
      <div className="space-y-2">
        {categories.map((c) => (
          <form key={c.id} action={async (fd) => { "use server"; await updateCategory(c.id, { name: fd.get("name"), parentId: fd.get("parentId") || null }); }} className="card flex gap-2 items-center">
            <input name="name" defaultValue={c.name} />
            <select name="parentId"><option value="">No parent</option>{categories.filter((x) => x.id !== c.id).map((p) => <option key={p.id} value={p.id} selected={p.id === c.parentId!}>{p.name}</option>)}</select>
            <button type="submit">Save</button>
            <button formAction={async () => { "use server"; await deleteCategory(c.id); }}>Delete</button>
          </form>
        ))}
      </div>
    </div>
  );
}
