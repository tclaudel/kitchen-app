import { NextResponse } from "next/server";
import { errorResponse, jsonBody, rateLimit, safeRecipe, securityHeaders, text } from "@/lib/api-security";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const limited = rateLimit(request);
  if (limited) return limited;
  const body = await jsonBody(request);
  const recipeText = text(body?.text, 50_000);
  if (!recipeText) return errorResponse("Collez un texte de recette.", 400);

  const serverUrl = process.env.OPENCODE_SERVER_URL ?? "http://127.0.0.1:4096";
  const password = process.env.OPENCODE_SERVER_PASSWORD;
  const configuredModel = process.env.OPENCODE_MODEL ?? "opencode-go/kimi-k2.6";
  const [providerID, modelID] = configuredModel.split("/", 2);
  if (!password) return errorResponse("OpenCode Server n'est pas configuré.", 503);

  const auth = `Basic ${Buffer.from(`opencode:${password}`).toString("base64")}`;
  const sessionResponse = await fetch(`${serverUrl}/session`, { method: "POST", headers: { Authorization: auth, "Content-Type": "application/json" }, body: JSON.stringify({ title: "Recipe text parsing" }) });
  if (!sessionResponse.ok) return errorResponse("Impossible de créer une session OpenCode.", 502);
  const session = await sessionResponse.json() as { id: string };
   const messageResponse = await fetch(`${serverUrl}/session/${session.id}/message`, { method: "POST", headers: { Authorization: auth, "Content-Type": "application/json" }, body: JSON.stringify({ model: { providerID, modelID }, parts: [{ type: "text", text: `Structure this recipe text. Return only valid JSON with title (string), ingredients (array of strings), steps (array of strings), prepTimeMinutes (integer minutes or null), cookTimeMinutes (integer minutes or null), and servings (integer or null). Extract preparation and cooking durations when present. Never invent missing information.\n\n${recipeText}` }] }) });
  if (!messageResponse.ok) return errorResponse("OpenCode n'a pas pu structurer ce texte.", 502);
  const payload = await messageResponse.json() as { parts?: Array<{ type?: string; text?: string }> };
  const content = payload.parts?.find((part) => part.type === "text")?.text;
  try {
    const recipe = JSON.parse(content?.match(/\{[\s\S]*\}/)?.[0] ?? content ?? "");
     const safe = safeRecipe(recipe);
     if (!safe) throw new Error("Incomplete");
     return securityHeaders(NextResponse.json(safe));
  } catch {
     return errorResponse("La réponse OpenCode n'a pas le format attendu.", 422);
  }
}
