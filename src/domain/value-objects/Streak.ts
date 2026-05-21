export class Streak {
  readonly current: number;
  readonly longest: number;
  readonly lastActivityAt: Date | null;

  constructor(current: number, longest: number, lastActivityAt: Date | null) {
    this.current = Math.max(0, current);
    this.longest = Math.max(0, longest);
    this.lastActivityAt = lastActivityAt;
  }

  isActiveToday(): boolean {
    if (!this.lastActivityAt) return false;
    const today = new Date();
    const last = this.lastActivityAt;
    return (
      last.getFullYear() === today.getFullYear() &&
      last.getMonth() === today.getMonth() &&
      last.getDate() === today.getDate()
    );
  }

  isAtRisk(): boolean {
    if (!this.lastActivityAt || this.current === 0) return false;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return !this.isActiveToday();
  }

  message(): string {
    if (this.current === 0) return "Empieza hoy tu racha";
    if (this.current === 1) return "¡Primer día!";
    if (this.current < 7) return `${this.current} días seguidos`;
    if (this.current < 30) return `${this.current} días 🔥`;
    return `${this.current} días ⚡ ¡Increíble!`;
  }
}
