import Link from "next/link";
import { getRunningSession } from "@/lib/data";

export async function NowRunningWidget() {
  const session = await getRunningSession();
  return (
    <div className="fixed right-5 bottom-5 card w-72 z-20">
      <div className="text-xs text-zinc-400">Now Running</div>
      {session ? (
        <>
          <div className="font-semibold">{session.category.name}</div>
          <div className="text-sm text-zinc-400">Started {new Date(session.startTime).toLocaleTimeString()}</div>
        </>
      ) : (
        <div className="text-sm text-zinc-400">No active timer</div>
      )}
      <Link href="/timer" className="text-accent text-sm">Open timer →</Link>
    </div>
  );
}
