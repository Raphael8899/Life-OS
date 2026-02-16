import Link from "next/link";

const links = [
  ["Dashboard", "/dashboard"],
  ["Timer", "/timer"],
  ["Categories", "/categories"],
  ["Habits", "/habits"],
  ["History", "/history"],
  ["Settings", "/settings"],
  ["Lock-in", "/lock-in"],
];

export function Sidebar() {
  return (
    <aside className="w-56 border-r border-zinc-800 p-4 space-y-2">
      <h1 className="text-2xl font-bold text-accent">LifeOS</h1>
      {links.map(([label, href]) => (
        <Link key={href} href={href} className="block px-3 py-2 rounded hover:bg-zinc-800">
          {label}
        </Link>
      ))}
    </aside>
  );
}
