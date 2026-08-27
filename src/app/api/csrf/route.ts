import { NextResponse } from "next/server";
import { issueCsrfToken } from "@/lib/security/csrf";

export const dynamic = "force-dynamic";

/** Issues the CSRF cookie and returns the token for the client to echo back. */
export async function GET() {
  const token = await issueCsrfToken();
  return NextResponse.json(
    { token },
    { headers: { "cache-control": "no-store" } },
  );
}
