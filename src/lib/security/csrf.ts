import { cookies } from "next/headers";

/**
 * Double-submit CSRF protection — Section 9.
 *
 * A random token is issued in a SameSite=Strict cookie and must be echoed in
 * the x-csrf-token header. An attacker's origin can cause the cookie to be
 * sent but cannot read it to set the header. Comparison is constant-time.
 */
export const CSRF_COOKIE = "ch_csrf";
export const CSRF_HEADER = "x-csrf-token";
const TOKEN_LENGTH = 43;

export function createToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function issueCsrfToken(): Promise<string> {
  const store = await cookies();
  const existing = store.get(CSRF_COOKIE)?.value;
  if (existing && existing.length === TOKEN_LENGTH) return existing;

  const token = createToken();
  store.set(CSRF_COOKIE, token, {
    httpOnly: false, // The client must read it to echo it back.
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return token;
}

export async function verifyCsrf(request: Request): Promise<boolean> {
  const store = await cookies();
  const cookieToken = store.get(CSRF_COOKIE)?.value;
  const headerToken = request.headers.get(CSRF_HEADER);
  if (!cookieToken || !headerToken) return false;
  return timingSafeEqual(cookieToken, headerToken);
}

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
