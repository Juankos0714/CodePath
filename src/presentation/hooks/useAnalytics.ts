"use client";

import { useCallback } from "react";
import { analytics } from "@/infrastructure/analytics/PostHogService";
import type { AnalyticsEvent, EventProperties } from "@/infrastructure/analytics/PostHogService";

export function useAnalytics() {
  const track = useCallback(
    (event: AnalyticsEvent, properties?: EventProperties) => {
      analytics.track(event, properties);
    },
    []
  );

  return { track };
}
