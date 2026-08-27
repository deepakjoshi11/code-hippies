import { z } from "zod";
import { budgetBands, projectTypes, timelineBands } from "@/data/pricing";

/*
 * Zod compiles validators with `new Function` when it can. That feature probe
 * is a CSP eval violation under this site's `script-src 'self' 'unsafe-inline'`
 * policy — harmless, because Zod catches the failure and falls back to the
 * interpreted path, but it is a real violation reported in Chrome's Issues
 * panel and it fails the Best Practices audit. Opting out of the JIT removes
 * it entirely; the interpreted path is more than fast enough for form schemas.
 */
z.config({ jitless: true });

/**
 * Validation schemas — Section 9.
 *
 * Defined once and enforced on BOTH sides: the client uses them for immediate
 * feedback, and every route handler parses with the same schema again before
 * anything is acted on. The client is not a trust boundary.
 */

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(160),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  projectType: z.enum(projectTypes as unknown as [string, ...string[]], {
    message: "Choose the closest project type",
  }),
  budget: z.enum(budgetBands as unknown as [string, ...string[]], {
    message: "Choose a budget band",
  }),
  timeline: z.enum(timelineBands as unknown as [string, ...string[]], {
    message: "Choose a timeline",
  }),
  message: z
    .string()
    .trim()
    .min(20, "A sentence or two about the project helps — 20 characters minimum")
    .max(4000, "Please keep it under 4000 characters"),
  /**
   * Honeypot. Real users never see this field, so anything in it is a bot.
   * Named plausibly on purpose — "website" is what naive form-fillers target.
   */
  website: z.string().max(0).optional().or(z.literal("")),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const chatSchema = z.object({
  question: z
    .string()
    .trim()
    .min(3, "Ask a slightly longer question")
    .max(500, "Please keep questions under 500 characters"),
});

export type ChatInput = z.infer<typeof chatSchema>;
