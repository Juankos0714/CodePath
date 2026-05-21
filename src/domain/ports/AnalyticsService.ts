import type { AnalyticsEvent, EventProperties } from "@/infrastructure/analytics/PostHogService";

export interface AnalyticsService {
  track(event: AnalyticsEvent, properties?: EventProperties): void;
  identify(userId: string, traits?: EventProperties): void;
}
