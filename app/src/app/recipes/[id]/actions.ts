"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function deleteRecipe(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.$transaction([
    prisma.recipeRevision.deleteMany({ where: { recipeId: id } }),
    prisma.incidentReport.deleteMany({ where: { recipeId: id } }),
    prisma.recipe.delete({ where: { id } }),
  ]);
  redirect("/recipes");
}
