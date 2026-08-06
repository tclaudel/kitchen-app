import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateRecipe } from "./actions";

const lines = (value: string) => { try { return (JSON.parse(value) as string[]).join("\n"); } catch { return value; } };

export default async function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recipe = await prisma.recipe.findUnique({ where: { id } });
  if (!recipe) notFound();
  return <main className="min-h-screen bg-[#f8f5ef] px-5 py-8 text-[#27352d] sm:px-8"><div className="mx-auto max-w-3xl"><Link href={`/recipes/${id}`} className="text-sm text-[#718078]">← Retour</Link><h1 className="mt-8 font-serif text-5xl">Modifier la recette</h1><form action={updateRecipe} className="mt-8 space-y-5 rounded-3xl bg-white p-6 sm:p-10"><input type="hidden" name="id" value={id} /><label className="block text-sm font-semibold">Titre<input name="title" defaultValue={recipe.title} className="mt-2 w-full rounded-xl border p-3" /></label><label className="block text-sm font-semibold">Ingrédients<textarea name="ingredients" defaultValue={lines(recipe.ingredients)} className="mt-2 min-h-40 w-full rounded-xl border p-3" /></label><label className="block text-sm font-semibold">Préparation<textarea name="steps" defaultValue={lines(recipe.steps)} className="mt-2 min-h-48 w-full rounded-xl border p-3" /></label><div className="grid gap-4 sm:grid-cols-3">{[["prepTimeMinutes","Préparation (min)",recipe.prepTimeMinutes],["cookTimeMinutes","Cuisson (min)",recipe.cookTimeMinutes],["servings","Portions",recipe.servings]].map(([name,label,value]) => <label key={String(name)} className="text-sm font-semibold">{label}<input name={String(name)} type="number" min="1" defaultValue={value ?? ""} className="mt-2 w-full rounded-xl border p-3" /></label>)}</div><button className="w-full rounded-2xl bg-[#27352d] px-5 py-4 font-semibold text-white">Enregistrer les modifications</button></form></div></main>;
}
