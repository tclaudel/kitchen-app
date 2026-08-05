import { NextResponse } from "next/server";
import sharp from "sharp";
import { errorResponse, rateLimit, safeRecipe, securityHeaders } from "@/lib/api-security";

export const runtime = "nodejs";

type ExtractedRecipe = {
  title: string;
  ingredients: string[];
  steps: string[];
};

export async function POST(request: Request) {
  const limited = rateLimit(request);
  if (limited) return limited;
  const formData = await request.formData();
  const image = formData.get("image");

  const isHeic = image instanceof File && (/\.(heic|heif)$/i.test(image.name) || image.type === "image/heic" || image.type === "image/heif");
  if (!(image instanceof File) || image.size > 10_000_000 || (!image.type.startsWith("image/") && !isHeic)) {
    return errorResponse("Veuillez sélectionner une image valide de moins de 10 Mo.", 400);
  }

  const serverUrl = process.env.OPENCODE_SERVER_URL ?? "http://127.0.0.1:4096";
  const password = process.env.OPENCODE_SERVER_PASSWORD;
  const configuredModel = process.env.OPENCODE_MODEL;
  const [providerID, modelID] = configuredModel?.includes("/")
    ? configuredModel.split("/", 2)
    : ["opencode-go", configuredModel ?? "kimi-k2.6"];
  console.info("[ocr] request", { name: image.name, type: image.type, size: image.size, serverUrl, model: `${providerID}/${modelID}` });
  if (!password) {
    return errorResponse("OpenCode Server n'est pas configuré.", 503);
  }

  const auth = `Basic ${Buffer.from(`opencode:${password}`).toString("base64")}`;
  const health = await fetch(`${serverUrl}/global/health`, { headers: { Authorization: auth } }).catch(() => null);
  if (!health?.ok) {
    return errorResponse("OpenCode Server est inaccessible.", 503);
  }

  const sessionResponse = await fetch(`${serverUrl}/session`, {
    method: "POST",
    headers: { Authorization: auth, "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Recipe OCR" }),
  });
  if (!sessionResponse.ok) {
    const details = await sessionResponse.text();
    console.error("[ocr] session error", sessionResponse.status, details);
    return errorResponse("Impossible de créer une session OpenCode.", 502);
  }
  const session = await sessionResponse.json() as { id: string };

  let imageBytes: Buffer<ArrayBufferLike> = Buffer.from(await image.arrayBuffer());
  let imageMime = image.type;
  if (isHeic || imageBytes.length > 2_000_000) {
    try {
      imageBytes = await sharp(imageBytes).resize({ width: 2000, withoutEnlargement: true }).jpeg({ quality: 82 }).toBuffer();
      imageMime = "image/jpeg";
    } catch (error) {
      console.error("[ocr] HEIC conversion failed", error);
      return errorResponse("Ce serveur ne peut pas décoder ce fichier HEIC. Utilisez une photo JPEG ou PNG.", 415);
    }
  }
  const base64 = imageBytes.toString("base64");
  const messageResponse = await fetch(`${serverUrl}/session/${session.id}/message`, {
    method: "POST",
    headers: { Authorization: auth, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: { providerID, modelID },
      parts: [
        { type: "text", text: "Extract this recipe. Return only valid JSON with title (string), ingredients (array of strings), and steps (array of strings). Preserve the image faithfully and never invent missing information." },
        { type: "file", mime: imageMime, url: `data:${imageMime};base64,${base64}`, filename: image.name.replace(/\.heic$/i, ".jpg") },
      ],
    }),
  });

  if (!messageResponse.ok) {
    const details = await messageResponse.text();
    console.error("[ocr] message error", { status: messageResponse.status, details, model: `${providerID}/${modelID}`, mime: image.type, bytes: image.size });
    return errorResponse("OpenCode n'a pas pu analyser cette image.", 502);
  }
  const payload = await messageResponse.json() as { parts?: Array<{ type?: string; text?: string }> };
  const content = payload.parts?.find((part) => part.type === "text")?.text;
  if (!content) return NextResponse.json({ error: "OpenCode n'a retourné aucune recette." }, { status: 422 });

  try {
    const json = content.match(/\{[\s\S]*\}/)?.[0];
    const recipe = JSON.parse(json ?? content) as ExtractedRecipe;
    const safe = safeRecipe(recipe);
    if (!safe) throw new Error("Incomplete extraction");
    return securityHeaders(NextResponse.json(safe));
  } catch {
    return errorResponse("La réponse OpenCode n'a pas le format attendu.", 422);
  }
}
