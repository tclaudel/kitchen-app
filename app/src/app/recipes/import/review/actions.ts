"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "node:crypto";
import { smartCooklang } from "@/lib/cooklang";

export async function saveRecipe(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const ingredients = String(formData.get("ingredients") ?? "").split("\n").map((item) => item.trim()).filter(Boolean);
  const steps = String(formData.get("steps") ?? "").split("\n").map((item) => item.trim()).filter(Boolean);
  const parsePositiveInt = (value: FormDataEntryValue | null) => {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
  };
  const prepTimeMinutes = parsePositiveInt(formData.get("prepTimeMinutes"));
  const cookTimeMinutes = parsePositiveInt(formData.get("cookTimeMinutes"));
  const servings = parsePositiveInt(formData.get("servings"));
  const incident = String(formData.get("incident") ?? "").trim();

  if (!title || ingredients.length === 0 || steps.length === 0) return;

  const cooklang = await smartCooklang({ title, ingredients, steps, prepTimeMinutes, cookTimeMinutes, servings });

  const recipe = await prisma.recipe.create({
    data: {
      id: `recipe-${randomUUID()}`,
      title,
      ingredients: JSON.stringify(ingredients),
      steps: JSON.stringify(steps),
      cooklang,
      prepTimeMinutes,
      cookTimeMinutes,
      servings,
      sourceType: "photo",
    },
  });

  if (incident) {
    await prisma.incidentReport.create({ data: { recipeId: recipe.id, message: incident } });
  }

  redirect(`/recipes/${recipe.id}`);
}
