import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/schemas";
import { clientKey, rateLimit } from "@/lib/security/rate-limit";
import { verifyCsrf } from "@/lib/security/csrf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;

export async function POST(request: Request) {
  if (!(await verifyCsrf(request))) {
    return NextResponse.json({ error: "Invalid request token. Reload the page and try again." }, { status: 403 });
  }

  const limit = rateLimit(clientKey(request, "lead"), LIMIT, WINDOW_MS);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many submissions from this connection. Message on WhatsApp instead." },
      { status: 429, headers: { "retry-after": String(limit.retryAfter) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Please check the form.", field: parsed.error.issues[0]?.path[0] },
      { status: 400 },
    );
  }

  // Honeypot: invisible to humans, irresistible to naive bots. Return 200 so
  // the bot believes it succeeded and does not retry with variations.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const lead = parsed.data;

  try {
    await deliverLead(lead);
  } catch (error) {
    // Log server-side detail; never return it. A stack trace in a response is
    // a free architecture diagram.
    console.error("[lead] delivery failed", error);
    return NextResponse.json(
      { error: "Could not send that just now. Please message on WhatsApp — it always gets through." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}

/**
 * Lead delivery.
 *
 * Configure LEAD_WEBHOOK_URL (a Slack/Discord/Zapier/CRM endpoint) to receive
 * submissions. With nothing configured the lead is logged server-side so a
 * fresh deployment never silently discards an enquiry — see .env.example.
 */
async function deliverLead(lead: Record<string, unknown>): Promise<void> {
  const webhook = process.env.LEAD_WEBHOOK_URL;

  const summary = [
    `New project brief — ${lead.projectType}`,
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    lead.company ? `Company: ${lead.company}` : null,
    `Budget: ${lead.budget}`,
    `Timeline: ${lead.timeline}`,
    "",
    String(lead.message),
  ]
    .filter(Boolean)
    .join("\n");

  if (!webhook) {
    console.info("[lead] no LEAD_WEBHOOK_URL configured; captured brief:\n%s", summary);
    return;
  }

  const response = await fetch(webhook, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text: summary, lead }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) throw new Error(`Webhook returned ${response.status}`);
}
