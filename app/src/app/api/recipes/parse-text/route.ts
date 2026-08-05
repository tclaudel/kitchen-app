import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { text } = await request.json() as { text?: string };
  if (!text?.trim()) return NextResponse.json({ error: "Collez un texte de recette." }, { status: 400 });

  const serverUrl = process.env.OPENCODE_SERVER_URL ?? "http://127.0.0.1:4096";
  const password = process.env.OPENCODE_SERVER_PASSWORD;
  const configuredModel = process.env.OPENCODE_MODEL ?? "opencode-go/kimi-k2.6";
  const [providerID, modelID] = configuredModel.split("/", 2);
  if (!password) return NextResponse.json({ error: "OpenCode Server n'est pas configuré." }, { status: 503 });

  const auth = `Basic ${Buffer.from(`opencode:${password}`).toString("base64")}`;
  const sessionResponse = await fetch(`${serverUrl}/session`, { method: "POST", headers: { Authorization: auth, "Content-Type": "application/json" }, body: JSON.stringify({ title: "Recipe text parsing" }) });
  if (!sessionResponse.ok) return NextResponse.json({ error: "Impossible de créer une session OpenCode." }, { status: 502 });
  const session = await sessionResponse.json() as { id: string };
  const messageResponse = await fetch(`${serverUrl}/session/${session.id}/message`, { method: "POST", headers: { Authorization: auth, "Content-Type": "application/json" }, body: JSON.stringify({ model: { providerID, modelID }, parts: [{ type: "text", text: `Structure this recipe text. Return only valid JSON with title (string), ingredients (array of strings), and steps (array of strings). Never invent missing information.\n\n${text}` }] }) });
  if (!messageResponse.ok) return NextResponse.json({ error: "OpenCode n'a pas pu structurer ce texte." }, { status: 502 });
  const payload = await messageResponse.json() as { parts?: Array<{ type?: string; text?: string }> };
  const content = payload.parts?.find((part) => part.type === "text")?.text;
  try {
    const recipe = JSON.parse(content?.match(/\{[\s\S]*\}/)?.[0] ?? content ?? "");
    if (!recipe.title || !recipe.ingredients?.length || !recipe.steps?.length) throw new Error("Incomplete");
    return NextResponse.json(recipe);
  } catch {
    return NextResponse.json({ error: "La réponse OpenCode n'a pas le format attendu." }, { status: 422 });
  }
}
