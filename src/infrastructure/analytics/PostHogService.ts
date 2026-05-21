"use client";

import posthog from "posthog-js";

export type AnalyticsEvent =
  // Activación
  | "user_signed_up"
  | "onboarding_completed"
  | "first_lesson_started"
  // Engagement
  | "lesson_started"
  | "lesson_completed"
  | "exercise_attempted"
  | "exercise_solved"
  | "exercise_failed"
  | "hint_requested"
  // Retención
  | "streak_maintained"
  | "streak_broken"
  | "badge_earned"
  | "level_up"
  // Conversión (v2)
  | "capstone_started"
  | "capstone_completed"
  | "certificate_generated";

export type EventProperties = Record<string, string | number | boolean | null>;

class PostHogAnalyticsService {
  private initialized = false;

  init(userId?: string) {
    if (this.initialized || typeof window === "undefined") return;

    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
    if (!key) return;

    posthog.init(key, {
      api_host: host ?? "https://app.posthog.com",
      person_profiles: "identified_only",
      capture_pageview: true,
      capture_pageleave: true,
    });

    if (userId) {
      posthog.identify(userId);
    }

    this.initialized = true;
  }

  identify(userId: string, traits?: EventProperties) {
    if (!this.initialized) return;
    posthog.identify(userId, traits ?? {});
  }

  track(event: AnalyticsEvent, properties?: EventProperties) {
    if (!this.initialized) return;
    posthog.capture(event, properties ?? {});
  }

  reset() {
    if (!this.initialized) return;
    posthog.reset();
  }
}

export const analytics = new PostHogAnalyticsService();
