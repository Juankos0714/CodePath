export interface User {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  totalXP: number;
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityAt: Date | null;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function userFromRow(row: {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  total_xp: number;
  current_level: number;
  current_streak: number;
  longest_streak: number;
  last_activity_at: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}): User {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    bio: row.bio,
    totalXP: row.total_xp,
    currentLevel: row.current_level,
    currentStreak: row.current_streak,
    longestStreak: row.longest_streak,
    lastActivityAt: row.last_activity_at ? new Date(row.last_activity_at) : null,
    onboardingCompleted: row.onboarding_completed,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}
