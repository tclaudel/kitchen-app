import { prisma } from "@/lib/prisma";
import { RecipeLibrary } from "./RecipeLibrary";

export const dynamic = "force-dynamic";

export default async function RecipesPage() {
  const recipes = await prisma.recipe.findMany({ orderBy: { createdAt: "desc" } });
  return <RecipeLibrary recipes={recipes} />;
}
