import type { User } from "@/domain/entities/User";

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  update(id: string, data: Partial<Omit<User, "id" | "createdAt">>): Promise<User>;
  awardXP(id: string, xp: number): Promise<number>;
  updateStreak(id: string): Promise<void>;
}
