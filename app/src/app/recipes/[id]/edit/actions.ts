"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function updateRecipe(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const recipe = await prisma.recipe.findUnique({ where: { id } });
  if (!recipe) return;

  const title = String(formData.get("title") ?? "").trim();
  const modifiedBy = String(formData.get("modifiedBy") ?? "").trim() || "Utilisateur";
  const ingredients = String(formData.get("ingredients") ?? "").split("\n").map((value) => value.trim()).filter(Boolean);
  const steps = String(formData.get("steps") ?? "").split("\n").map((value) => value.trim()).filter(Boolean);
  const number = (name: string) => { const value = Number(formData.get(name)); return Number.isInteger(value) && value > 0 ? value : null; };
  if (!title || !ingredients.length || !steps.length) return;

  await prisma.$transaction([
    prisma.recipeRevision.create({ data: { recipeId: id, modifiedBy, title: recipe.title, ingredients: recipe.ingredients, steps: recipe.steps, cooklang: recipe.cooklang, prepTimeMinutes: recipe.prepTimeMinutes, cookTimeMinutes: recipe.cookTimeMinutes, servings: recipe.servings } }),
    prisma.recipe.update({ where: { id }, data: { title, ingredients: JSON.stringify(ingredients), steps: JSON.stringify(steps), prepTimeMinutes: number("prepTimeMinutes"), cookTimeMinutes: number("cookTimeMinutes"), servings: number("servings") } }),
  ]);
  redirect(`/recipes/${id}`);
}
