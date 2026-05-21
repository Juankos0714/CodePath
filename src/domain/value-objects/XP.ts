export class XP {
  readonly value: number;

  private constructor(value: number) {
    this.value = value;
  }

  static of(value: number): XP {
    if (value < 0) throw new Error("XP no puede ser negativo");
    return new XP(Math.floor(value));
  }

  static zero(): XP {
    return new XP(0);
  }

  add(other: XP): XP {
    return new XP(this.value + other.value);
  }

  toLevel(): number {
    return Math.floor(Math.sqrt(this.value / 100)) + 1;
  }

  xpToNextLevel(): { current: number; needed: number; percent: number } {
    const level = this.toLevel();
    const xpForCurrentLevel = (level - 1) ** 2 * 100;
    const xpForNextLevel = level ** 2 * 100;
    const current = this.value - xpForCurrentLevel;
    const needed = xpForNextLevel - xpForCurrentLevel;
    return {
      current,
      needed,
      percent: Math.min(100, Math.round((current / needed) * 100)),
    };
  }

  format(): string {
    if (this.value >= 1000) return `${(this.value / 1000).toFixed(1)}k XP`;
    return `${this.value} XP`;
  }
}
