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
  const optionalMinutes = (item: unknown) => {
    if (typeof item === "number") return Number.isInteger(item) && item >= 0 && item <= 24 * 60 ? item : null;
    if (typeof item !== "string") return null;
    const value = item.trim().toLowerCase();
    const iso = value.match(/^pt(?:(\d+(?:\.\d+)?)h)?(?:(\d+(?:\.\d+)?)m)?$/);
    if (iso) {
      const minutes = Number(iso[1] ?? 0) * 60 + Number(iso[2] ?? 0);
      return Number.isInteger(minutes) && minutes <= 24 * 60 ? minutes : null;
    }
    const hours = value.match(/(\d+(?:[.,]\d+)?)\s*(?:h|heure|heures)/)?.[1];
    const minutes = value.match(/(\d+)\s*(?:m|min|minute|minutes)/)?.[1];
    if (!hours && !minutes) return null;
    const total = Math.round(Number((hours ?? "0").replace(",", ".")) * 60) + Number(minutes ?? 0);
    return Number.isInteger(total) && total <= 24 * 60 ? total : null;
  };
  const prepTimeMinutes = optionalMinutes(recipe.prepTimeMinutes);
  const cookTimeMinutes = optionalMinutes(recipe.cookTimeMinutes);
  const servings = typeof recipe.servings === "number" && Number.isInteger(recipe.servings) && recipe.servings > 0 ? recipe.servings : null;
  return title && ingredients.length && steps.length ? { title, ingredients, steps, prepTimeMinutes, cookTimeMinutes, servings } : null;
}

export function errorResponse(message: string, status: number) {
  return securityHeaders(NextResponse.json({ error: message }, { status }));
}
