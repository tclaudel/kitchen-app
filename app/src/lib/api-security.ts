import { NextResponse } from "next/server";

const buckets = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;

export function securityHeaders(response: NextResponse) {
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}

export function clientKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export function rateLimit(request: Request) {
  const now = Date.now();
  const key = clientKey(request);
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return null;
  }
  current.count += 1;
  if (current.count <= MAX_REQUESTS) return null;
  const response = NextResponse.json({ error: "Trop de requêtes. Réessayez plus tard." }, { status: 429 });
  response.headers.set("Retry-After", String(Math.ceil((current.resetAt - now) / 1000)));
  return securityHeaders(response);
}

export async function jsonBody(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) return null;
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 256_000) return null;
  try { return await request.json() as Record<string, unknown>; } catch { return null; }
}

export function text(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export function safeRecipe(value: unknown) {
  if (!value || typeof value !== "object") return null;
  const recipe = value as Record<string, unknown>;
  const title = text(recipe.title, 200);
  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients.map((item) => text(item, 500)).filter(Boolean).slice(0, 100) : [];
  const steps = Array.isArray(recipe.steps) ? recipe.steps.map((item) => text(item, 2_000)).filter(Boolean).slice(0, 100) : [];
  return title && ingredients.length && steps.length ? { title, ingredients, steps } : null;
}

export function errorResponse(message: string, status: number) {
  return securityHeaders(NextResponse.json({ error: message }, { status }));
}
