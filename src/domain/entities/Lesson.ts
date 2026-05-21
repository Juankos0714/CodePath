export interface Lesson {
  id: string;
  moduleId: string;
  slug: string;
  title: string;
  description: string | null;
  contentMd: string;
  orderIndex: number;
  xpReward: number;
  estimatedMinutes: number;
  isPublished: boolean;
  createdAt: Date;
}

export function lessonFromRow(row: {
  id: string;
  module_id: string;
  slug: string;
  title: string;
  description: string | null;
  content_md: string;
  order_index: number;
  xp_reward: number;
  estimated_minutes: number;
  is_published: boolean;
  created_at: string;
}): Lesson {
  return {
    id: row.id,
    moduleId: row.module_id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    contentMd: row.content_md,
    orderIndex: row.order_index,
    xpReward: row.xp_reward,
    estimatedMinutes: row.estimated_minutes,
    isPublished: row.is_published,
    createdAt: new Date(row.created_at),
  };
}
