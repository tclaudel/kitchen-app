import { NextResponse } from "next/server";

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

export async function POST(request: Request) {
  const { url } = await request.json() as { url?: string };
  let parsedUrl: URL;
  try { parsedUrl = new URL(url ?? ""); } catch { return NextResponse.json({ error: "Veuillez fournir une URL valide." }, { status: 400 }); }
  if (!/^https?:$/.test(parsedUrl.protocol)) return NextResponse.json({ error: "Seules les URLs HTTP et HTTPS sont acceptées." }, { status: 400 });

  const response = await fetch(parsedUrl, { headers: { "User-Agent": "Recettes-en-famille/1.0 recipe importer" } }).catch(() => null);
  if (!response?.ok) return NextResponse.json({ error: "La page n'a pas pu être consultée." }, { status: 502 });
  const html = await response.text();
  const scripts = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const match of scripts) {
    try {
      const draft = toDraft(findRecipeSchema(JSON.parse(match[1])) ?? {});
      if (draft) return NextResponse.json(draft);
    } catch { /* Try the next JSON-LD block. */ }
  }

  const serverUrl = process.env.OPENCODE_SERVER_URL ?? "http://127.0.0.1:4096";
  const password = process.env.OPENCODE_SERVER_PASSWORD;
  const configuredModel = process.env.OPENCODE_MODEL ?? "opencode-go/kimi-k2.6";
  const [providerID, modelID] = configuredModel.split("/", 2);
  if (!password) return NextResponse.json({ error: "Aucune recette structurée trouvée et OpenCode n'est pas configuré pour analyser cette page." }, { status: 422 });
  const auth = `Basic ${Buffer.from(`opencode:${password}`).toString("base64")}`;
  const session = await fetch(`${serverUrl}/session`, { method: "POST", headers: { Authorization: auth, "Content-Type": "application/json" }, body: JSON.stringify({ title: "Recipe URL import" }) });
  if (!session.ok) return NextResponse.json({ error: "OpenCode n'a pas pu démarrer l'import." }, { status: 502 });
  const { id } = await session.json() as { id: string };
  const message = await fetch(`${serverUrl}/session/${id}/message`, { method: "POST", headers: { Authorization: auth, "Content-Type": "application/json" }, body: JSON.stringify({ model: { providerID, modelID }, parts: [{ type: "text", text: `Extract this recipe page. Return only JSON with title, ingredients array, and steps array. Never invent missing information. URL: ${parsedUrl}\n\n${html.slice(0, 120000)}` }] }) });
  if (!message.ok) return NextResponse.json({ error: "OpenCode n'a pas pu extraire la recette de cette page." }, { status: 502 });
  const payload = await message.json() as { parts?: Array<{ type?: string; text?: string }> };
  try {
    const content = payload.parts?.find((part) => part.type === "text")?.text ?? "";
    const draft = JSON.parse(content.match(/\{[\s\S]*\}/)?.[0] ?? content) as RecipeDraft;
    if (!draft.title || !draft.ingredients?.length || !draft.steps?.length) throw new Error("Incomplete");
    return NextResponse.json(draft);
  } catch { return NextResponse.json({ error: "La page ne contient pas de recette exploitable." }, { status: 422 }); }
}
