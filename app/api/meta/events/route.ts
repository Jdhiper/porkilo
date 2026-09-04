import { NextResponse } from "next/server";
import { META_PIXEL_ID } from "@/lib/meta-config";

export const runtime = "nodejs";

const META_API_VERSION = "v26.0";
const ALLOWED_EVENTS = new Set(["PageView", "InitiateCheckout"]);

type EventRequest = {
  eventName?: unknown;
  eventId?: unknown;
  eventSourceUrl?: unknown;
  fbp?: unknown;
  fbc?: unknown;
  customData?: unknown;
};

function optionalString(value: unknown, maximumLength: number) {
  return typeof value === "string" && value.length <= maximumLength ? value : undefined;
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const requestHost = forwardedHost || request.headers.get("host");

  if (!origin || !requestHost) return true;

  try {
    return new URL(origin).host === requestHost;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Origen no permitido." }, { status: 403 });
  }

  const pixelId = META_PIXEL_ID;
  const accessToken = process.env.META_CONVERSIONS_API_TOKEN;

  if (!pixelId || !/^\d+$/.test(pixelId) || !accessToken) {
    return NextResponse.json({ error: "Meta no está configurado." }, { status: 503 });
  }

  const body = await request.json().catch(() => null) as EventRequest | null;
  const eventName = optionalString(body?.eventName, 64);
  const eventId = optionalString(body?.eventId, 128);
  const eventSourceUrl = optionalString(body?.eventSourceUrl, 2048);

  if (
    !eventName
    || !ALLOWED_EVENTS.has(eventName)
    || !eventId
    || !/^[A-Za-z0-9_-]{8,128}$/.test(eventId)
    || !eventSourceUrl
  ) {
    return NextResponse.json({ error: "Evento inválido." }, { status: 400 });
  }

  try {
    const sourceUrl = new URL(eventSourceUrl);
    if (sourceUrl.protocol !== "http:" && sourceUrl.protocol !== "https:") throw new Error();
  } catch {
    return NextResponse.json({ error: "URL de origen inválida." }, { status: 400 });
  }

  const forwardedIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const clientIp = forwardedIp || request.headers.get("x-real-ip") || undefined;
  const userAgent = request.headers.get("user-agent") || undefined;
  const fbp = optionalString(body?.fbp, 255);
  const fbc = optionalString(body?.fbc, 255);
  const customData = body?.customData && typeof body.customData === "object" && !Array.isArray(body.customData)
    ? body.customData
    : undefined;

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: "website",
        event_source_url: eventSourceUrl,
        user_data: {
          ...(clientIp ? { client_ip_address: clientIp } : {}),
          ...(userAgent ? { client_user_agent: userAgent } : {}),
          ...(fbp ? { fbp } : {}),
          ...(fbc ? { fbc } : {}),
        },
        ...(customData ? { custom_data: customData } : {}),
      },
    ],
  };

  if (process.env.META_TEST_EVENT_CODE) {
    payload.test_event_code = process.env.META_TEST_EVENT_CODE;
  }

  const metaResponse = await fetch(
    `https://graph.facebook.com/${META_API_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    },
  );

  if (!metaResponse.ok) {
    return NextResponse.json({ error: "Meta rechazó el evento." }, { status: 502 });
  }

  return new NextResponse(null, { status: 204 });
}
