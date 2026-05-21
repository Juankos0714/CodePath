import { describe, it, expect } from "vitest";
import { Streak } from "./Streak";

describe("Streak value object", () => {
  it("shows 0 streak when never active", () => {
    const s = new Streak(0, 0, null);
    expect(s.current).toBe(0);
    expect(s.isActiveToday()).toBe(false);
  });

  it("detects active today", () => {
    const today = new Date();
    const s = new Streak(5, 10, today);
    expect(s.isActiveToday()).toBe(true);
  });

  it("detects streak at risk when last activity was yesterday", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const s = new Streak(3, 3, yesterday);
    expect(s.isAtRisk()).toBe(true);
  });

  it("returns correct messages", () => {
    expect(new Streak(0, 0, null).message()).toContain("Empieza");
    expect(new Streak(1, 1, new Date()).message()).toContain("Primer día");
    expect(new Streak(5, 5, new Date()).message()).toContain("5 días");
  });
});
