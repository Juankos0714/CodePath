import { describe, it, expect } from "vitest";
import { XP } from "./XP";

describe("XP value object", () => {
  it("starts at level 1 with 0 XP", () => {
    expect(XP.of(0).toLevel()).toBe(1);
  });

  it("reaches level 2 at 100 XP", () => {
    expect(XP.of(100).toLevel()).toBe(2);
  });

  it("reaches level 3 at 400 XP", () => {
    expect(XP.of(400).toLevel()).toBe(3);
  });

  it("adds XP correctly", () => {
    const a = XP.of(50);
    const b = XP.of(30);
    expect(a.add(b).value).toBe(80);
  });

  it("throws on negative XP", () => {
    expect(() => XP.of(-1)).toThrow();
  });

  it("formats large XP values", () => {
    expect(XP.of(1500).format()).toBe("1.5k XP");
  });

  it("calculates percent to next level", () => {
    const xp = XP.of(150);
    const { percent } = xp.xpToNextLevel();
    expect(percent).toBeGreaterThan(0);
    expect(percent).toBeLessThanOrEqual(100);
  });
});
