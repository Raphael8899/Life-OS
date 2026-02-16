import { describe, expect, it } from "vitest";
import { dayScore, levelFromXp, predictedGoalDate, projection, rollingAverage, streaks, xpFromMinutes } from "@/lib/analytics";

describe("analytics", () => {
  it("computes rolling average", () => {
    const out = rollingAverage([
      { date: "2026-01-01", minutes: 10 },
      { date: "2026-01-02", minutes: 20 },
      { date: "2026-01-03", minutes: 30 },
    ], 2);
    expect(out[2].minutes).toBe(25);
  });

  it("computes projection/xp/level", () => {
    expect(projection([{ date: "d", minutes: 120 }], 1, 30)).toBe(3600);
    expect(xpFromMinutes(100, 1)).toBe(10);
    expect(levelFromXp(900)).toBe(3);
  });

  it("computes streak and day score", () => {
    const s = streaks([{ date: "a", minutes: 60 }, { date: "b", minutes: 30 }, { date: "c", minutes: 70 }], 60);
    expect(s.longest).toBe(1);
    expect(dayScore({ lockedInMinutes: 200, wakeUpMinutesFromMidnight: 420, habitRatio: 0.5 })).toBeGreaterThan(0);
  });

  it("predicts goal date", () => {
    const date = predictedGoalDate(100, 10, 100, new Date("2026-01-01"));
    expect(date?.toISOString().slice(0, 10)).toBe("2026-01-06");
  });
});
