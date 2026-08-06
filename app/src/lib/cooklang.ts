type CooklangInput = {
  title: string;
  ingredients: string[];
  steps: string[];
  servings?: number | null;
  prepTimeMinutes?: number | null;
  cookTimeMinutes?: number | null;
};

export function localCooklang(recipe: CooklangInput) {
  const ingredientNames = recipe.ingredients.map((item) => item.replace(/^\s*\d+(?:[.,]\d+)?\s*/, "").trim()).filter(Boolean);
  const steps = recipe.steps.map((step) => {
    let result = step;
    for (const ingredient of ingredientNames) {
      const escaped = ingredient.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      result = result.replace(new RegExp(`\\b${escaped}\\b`, "i"), `@${ingredient}`);
    }
    return result;
  });
  return [
    "---",
    `servings: ${recipe.servings ?? 1}`,
    ...(recipe.prepTimeMinutes ? [`prep time: ${recipe.prepTimeMinutes} minutes`] : []),
    ...(recipe.cookTimeMinutes ? [`cook time: ${recipe.cookTimeMinutes} minutes`] : []),
    "---",
    "",
    `# ${recipe.title}`,
    "",
    ...steps,
  ].join("\n");
}

export async function smartCooklang(recipe: CooklangInput) {
  const password = process.env.OPENCODE_SERVER_PASSWORD;
  if (!password) return localCooklang(recipe);

  const serverUrl = process.env.OPENCODE_SERVER_URL ?? "http://127.0.0.1:4096";
  const configuredModel = process.env.OPENCODE_MODEL ?? "opencode-go/kimi-k2.6";
  const [providerID, modelID] = configuredModel.split("/", 2);
  const auth = `Basic ${Buffer.from(`opencode:${password}`).toString("base64")}`;
  try {
    const sessionResponse = await fetch(`${serverUrl}/session`, {
      method: "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Smart Cooklang generation" }),
      signal: AbortSignal.timeout(5_000),
    });
    if (!sessionResponse.ok) return localCooklang(recipe);
    const session = await sessionResponse.json() as { id?: string };
    if (!session.id) return localCooklang(recipe);

    const prompt = `Convert this recipe to valid Cooklang. Return only the Cooklang document, with YAML front matter, quantities preserved, ingredients annotated with @, cookware/tools with #, timers with ~, and clear steps. Do not invent ingredients, quantities, tools, or timers.\n\n${JSON.stringify(recipe)}`;
    const response = await fetch(`${serverUrl}/session/${session.id}/message`, {
      method: "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify({ model: { providerID, modelID }, parts: [{ type: "text", text: prompt }] }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) return localCooklang(recipe);
    const payload = await response.json() as { parts?: Array<{ type?: string; text?: string }> };
    const content = payload.parts?.find((part) => part.type === "text")?.text?.trim();
    return content && content.includes("# ") ? content.replace(/^```(?:cooklang)?\s*|\s*```$/gi, "").trim() : localCooklang(recipe);
  } catch {
    return localCooklang(recipe);
  }
}
