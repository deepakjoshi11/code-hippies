import { INDEXNOW_KEY } from "@/lib/distribution/indexnow";

export const dynamic = "force-dynamic";

/**
 * IndexNow key verification file.
 *
 * The protocol requires the key served as plain text at
 * https://<host>/<key>.txt. A rewrite in next.config.ts maps that path here,
 * so rotating the key is an environment variable change rather than a commit.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;
  if (!INDEXNOW_KEY || key !== INDEXNOW_KEY) {
    return new Response("Not found", { status: 404 });
  }
  return new Response(INDEXNOW_KEY, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=86400",
    },
  });
}
