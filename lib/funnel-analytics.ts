"use client";

import { track } from "@vercel/analytics";

type FunnelProperties = Record<string, string | number | boolean | null | undefined>;

type ClarityClient = {
  (command: "event", eventName: string): void;
};

declare global {
  interface Window {
    clarity?: ClarityClient;
  }
}

export function trackFunnelEvent(eventName: string, properties?: FunnelProperties) {
  track(eventName, properties);
  window.clarity?.("event", eventName);
}

export function trackFunnelEventOnce(eventName: string) {
  const storageKey = `porkilo:funnel:${eventName}`;

  try {
    if (window.sessionStorage.getItem(storageKey)) return;
    window.sessionStorage.setItem(storageKey, "1");
  } catch {
    // La medición continúa aunque el navegador bloquee sessionStorage.
  }

  trackFunnelEvent(eventName);
}
