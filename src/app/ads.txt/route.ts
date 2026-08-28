import { getProvider } from "@/lib/analytics/providers";

export const dynamic = "force-dynamic";

/**
 * ads.txt — IAB Authorized Digital Sellers.
 *
 * Declares which companies may sell this site's inventory. Without it, AdSense
 * and Ad Manager treat the inventory as unauthorised and buyers discount or
 * refuse it, so a publisher without ads.txt earns materially less.
 *
 * Generated from the configured publisher ID rather than committed, so the
 * file cannot drift out of sync with the account actually serving ads — and
 * returns 404 when no advertising is configured, which is the correct
 * response for a site that sells nothing.
 */
export function GET() {
  const adsense = getProvider("adsense");
  const gam = getProvider("gam");

  const lines: string[] = [];

  if (adsense?.account) {
    // pub ID without the "ca-" prefix is the seller account id.
    const publisherId = adsense.account.replace(/^ca-/, "");
    lines.push(`google.com, ${publisherId}, DIRECT, f08c47fec0942fa0`);
  }
  if (gam?.account) {
    lines.push(`google.com, pub-${gam.account}, DIRECT, f08c47fec0942fa0`);
  }

  if (lines.length === 0) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(
    `# Authorized Digital Sellers for this domain.\n# Generated from configured providers — see src/lib/analytics/providers.ts\n${lines.join("\n")}\n`,
    {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "public, max-age=3600",
      },
    },
  );
}
