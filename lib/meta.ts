"use client";

import { META_PIXEL_ID } from "@/lib/meta-config";

export type MetaEventName = "PageView" | "ViewContent" | "InitiateCheckout";

export type MetaCustomData = Record<string, string | number | boolean>;

type FacebookPixel = (
  command: "track",
  eventName: MetaEventName,
  customData?: MetaCustomData,
  options?: { eventID: string },
) => void;

declare global {
  interface Window {
    fbq?: FacebookPixel;
  }
}

function readCookie(name: string) {
  const prefix = `${name}=`;
  const cookie = document.cookie
    .split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(prefix));

  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : undefined;
}

function createEventId(eventName: MetaEventName) {
  const suffix = typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}_${Math.random().toString(36).slice(2)}`;

  return `${eventName}_${suffix}`;
}

export function trackMetaEvent(eventName: MetaEventName, customData?: MetaCustomData) {
  if (typeof window === "undefined" || !META_PIXEL_ID) return;

  const eventId = createEventId(eventName);

  window.fbq?.("track", eventName, customData, { eventID: eventId });

  void fetch("/api/meta/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify({
      eventName,
      eventId,
      eventSourceUrl: window.location.href,
      fbp: readCookie("_fbp"),
      fbc: readCookie("_fbc"),
      customData,
    }),
  }).catch(() => {
    // La medición no debe bloquear ni interrumpir la compra.
  });
}
