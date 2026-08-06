import { NextResponse } from "next/server";
import { errorResponse, jsonBody, rateLimit, safeRecipe, securityHeaders, text } from "@/lib/api-security";

export const runtime = "nodejs";

type RecipeDraft = { title: string; ingredients: string[]; steps: string[] };

function clean(value: unknown) {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function findRecipeSchema(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object") return null;
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findRecipeSchema(item);
      if (found) return found;
    }
    return null;
  }
  const object = value as Record<string, unknown>;
  const type = object["@type"];
  if (type === "Recipe" || (Array.isArray(type) && type.includes("Recipe"))) return object;
  for (const item of Object.values(object)) {
    const found = findRecipeSchema(item);
    if (found) return found;
  }
  return null;
}

function toDraft(recipe: Record<string, unknown>): RecipeDraft | null {
  const ingredients = Array.isArray(recipe.recipeIngredient) ? recipe.recipeIngredient.map(clean).filter(Boolean) : [];
  const instructions = Array.isArray(recipe.recipeInstructions)
    ? recipe.recipeInstructions.map((item) => typeof item === "string" ? item : (item as Record<string, unknown>)?.text).map(clean).filter(Boolean)
    : clean(recipe.recipeInstructions).split(/\n|\r/).map((item) => item.trim()).filter(Boolean);
  const title = clean(recipe.name);
  return title && ingredients.length && instructions.length ? { title, ingredients, steps: instructions } : null;
}

function isPublicUrl(url: URL) {
  const host = url.hostname.toLowerCase();
  return !(
    host === "localhost" || host.endsWith(".localhost") || host === "127.0.0.1" ||
    host === "::1" || host.startsWith("10.") || host.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(host) || host === "169.254.169.254"
  );
}

export async function POST(request: Request) {
  const limited = rateLimit(request);
  if (limited) return limited;
  const body = await jsonBody(request);
  const url = text(body?.url, 2_000);
  let parsedUrl: URL;
  try { parsedUrl = new URL(url); } catch { return errorResponse("Veuillez fournir une URL valide.", 400); }
  if (!/^https?:$/.test(parsedUrl.protocol) || !isPublicUrl(parsedUrl)) return errorResponse("Cette URL n'est pas autorisée.", 400);

  const response = await fetch(parsedUrl, { headers: { "User-Agent": "Recettes-en-famille/1.0 recipe importer", Accept: "text/html" }, signal: AbortSignal.timeout(10_000), redirect: "error" }).catch(() => null);
  if (!response?.ok) return errorResponse("La page n'a pas pu être consultée.", 502);
  const contentLength = Number(response.headers.get("content-length") ?? 0);
  if (contentLength > 2_000_000) return errorResponse("La page est trop volumineuse.", 413);
  const html = (await response.text()).slice(0, 2_000_000);
  const scripts = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const match of scripts) {
    try {
      const draft = toDraft(findRecipeSchema(JSON.parse(match[1])) ?? {});
      if (draft) return securityHeaders(NextResponse.json(draft));
    } catch { /* Try the next JSON-LD block. */ }
  }

  const serverUrl = process.env.OPENCODE_SERVER_URL ?? "http://127.0.0.1:4096";
  const password = process.env.OPENCODE_SERVER_PASSWORD;
  const configuredModel = process.env.OPENCODE_MODEL ?? "opencode-go/kimi-k2.6";
  const [providerID, modelID] = configuredModel.split("/", 2);
  if (!password) return errorResponse("Aucune recette structurée trouvée et OpenCode n'est pas configuré pour analyser cette page.", 422);
  const auth = `Basic ${Buffer.from(`opencode:${password}`).toString("base64")}`;
  const session = await fetch(`${serverUrl}/session`, { method: "POST", headers: { Authorization: auth, "Content-Type": "application/json" }, body: JSON.stringify({ title: "Recipe URL import" }) });
  if (!session.ok) return errorResponse("OpenCode n'a pas pu démarrer l'import.", 502);
  const { id } = await session.json() as { id: string };
  const message = await fetch(`${serverUrl}/session/${id}/message`, { method: "POST", headers: { Authorization: auth, "Content-Type": "application/json" }, body: JSON.stringify({ model: { providerID, modelID }, parts: [{ type: "text", text: `Extract this recipe page. Return only JSON with title, ingredients array, and steps array. Never invent missing information. URL: ${parsedUrl}\n\n${html.slice(0, 120000)}` }] }) });
  if (!message.ok) return errorResponse("OpenCode n'a pas pu extraire la recette de cette page.", 502);
  const payload = await message.json() as { parts?: Array<{ type?: string; text?: string }> };
  try {
    const content = payload.parts?.find((part) => part.type === "text")?.text ?? "";
     const draft = JSON.parse(content.match(/\{[\s\S]*\}/)?.[0] ?? content) as RecipeDraft;
     const safe = safeRecipe(draft);
     if (!safe) throw new Error("Incomplete");
     return securityHeaders(NextResponse.json(safe));
   } catch { return errorResponse("La page ne contient pas de recette exploitable.", 422); }
}
