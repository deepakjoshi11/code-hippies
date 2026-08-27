import { z } from "zod";

/**
 * Telemetry event contract.
 *
 * Deliberately a closed enum rather than free-form: an open event name is an
 * open injection surface and an open storage cost. Anything not on this list
 * is rejected at the boundary.
 */
export const eventSchema = z.object({
  name: z.enum([
    "page_view",
    "cta_click",
    "channel_click",
    "partner_click",
    "chat_open",
    "chat_question",
    "chat_refusal",
    "faq_browse",
    "lead_step",
    "lead_submit",
    "scroll_depth",
  ]),
  /** Site path, never a full URL — no query strings, no fragments. */
  path: z.string().max(200).regex(/^\/[a-zA-Z0-9\-/_]*$/, "path must be a site-relative route"),
  /** Random per-tab id. Not persistent, not linked to a person. */
  session: z.string().max(64).regex(/^[a-zA-Z0-9_-]+$/).optional(),
  /** Small bag of non-identifying detail, e.g. { channel: "whatsapp" }. */
  meta: z.record(z.string().max(40), z.union([z.string().max(120), z.number(), z.boolean()])).optional(),
  /** Consent categories the visitor granted, echoed for server-side enforcement. */
  consent: z.object({ analytics: z.boolean(), attribution: z.boolean() }),
  /** Referrer HOST only when attribution is granted. Never the full URL. */
  referrerHost: z.string().max(120).optional(),
  /** UTM campaign, when attribution is granted. */
  campaign: z.string().max(80).optional(),
});

export type TelemetryEvent = z.infer<typeof eventSchema>;

export const telemetryBatchSchema = z.object({
  events: z.array(eventSchema).min(1).max(20),
});
