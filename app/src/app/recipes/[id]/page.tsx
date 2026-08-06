import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { deleteRecipe } from "./actions";
import { DeleteRecipeButton } from "./DeleteRecipeButton";

function parseList(value: string) {
  try {
    return JSON.parse(value) as string[];
  } catch {
    return [];
  }
}

function parseTags(value: string | null) {
  if (!value) return [];
  return parseList(value);
}

export const dynamic = "force-dynamic";

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recipe = await prisma.recipe.findUnique({ where: { id } });

  if (!recipe) notFound();

  const ingredients = parseList(recipe.ingredients);
  const steps = parseList(recipe.steps);
  const duration = [recipe.prepTimeMinutes, recipe.cookTimeMinutes].reduce<number>((total, value) => total + (value ?? 0), 0);

  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#27352d]">
      <header className="mx-auto flex max-w-4xl items-center justify-between px-5 py-6 sm:px-8">
        <Link href="/recipes" className="font-serif text-xl font-semibold tracking-tight">
          Recettes <span className="text-[#d66b4c]">en famille</span>
        </Link>
        <Link href="/recipes" className="rounded-full border border-[#d8d5cb] px-4 py-2 text-sm font-medium text-[#718078] transition hover:bg-white">
          ← Mes recettes
        </Link>
      </header>

      <article className="mx-auto max-w-4xl px-5 pb-20 sm:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-[#e1ded5] bg-white shadow-[0_18px_40px_rgba(45,54,45,0.08)]">
          <div className="flex min-h-56 items-end bg-gradient-to-br from-orange-200 via-amber-100 to-yellow-50 p-7 sm:min-h-72 sm:p-10">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#bd6045]">Recette du foyer · {parseTags(recipe.tags).join(" · ")}</p>
              <h1 className="max-w-2xl font-serif text-5xl leading-[0.95] tracking-tight sm:text-7xl">{recipe.title}</h1>
              {recipe.description && <p className="mt-5 max-w-xl text-lg leading-8 text-[#59695e]">{recipe.description}</p>}
            </div>
          </div>

          <div className="grid gap-4 border-b border-[#eeeae2] px-6 py-5 text-sm text-[#718078] sm:grid-cols-3 sm:px-10">
            {duration > 0 && <div><span className="block text-xs uppercase tracking-wider text-[#a2a79e]">Durée</span><strong className="mt-1 block text-[#27352d]">{duration} min</strong></div>}
            {recipe.servings && <div><span className="block text-xs uppercase tracking-wider text-[#a2a79e]">Portions</span><strong className="mt-1 block text-[#27352d]">{recipe.servings}</strong></div>}
            <div><span className="block text-xs uppercase tracking-wider text-[#a2a79e]">Source</span><strong className="mt-1 block text-[#27352d]">Photo / scan</strong></div>
          </div>

          <div className="grid gap-10 px-6 py-8 sm:grid-cols-[0.8fr_1.2fr] sm:px-10 sm:py-12">
            <section>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d66b4c]">01</p>
              <h2 className="mt-2 font-serif text-3xl">Ingrédients</h2>
              <ul className="mt-6 space-y-3">
                {ingredients.map((ingredient) => <li key={ingredient} className="border-b border-[#eeeae2] pb-3 text-base leading-6 text-[#4d5b51]">{ingredient}</li>)}
              </ul>
            </section>

            <section>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d66b4c]">02</p>
              <h2 className="mt-2 font-serif text-3xl">Préparation</h2>
              <ol className="mt-6 space-y-6">
                {steps.map((step, index) => <li key={`${index}-${step}`} className="flex gap-4"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#edf0e9] text-sm font-semibold text-[#607065]">{index + 1}</span><p className="pt-1 text-base leading-7 text-[#4d5b51]">{step}</p></li>)}
              </ol>
            </section>
          </div>

          <div className="flex flex-col gap-4 border-t border-[#eeeae2] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-10">
            <div className="flex flex-wrap items-center gap-2">
              <Link href={`/recipes/${recipe.id}/edit`} className="inline-flex min-h-10 items-center rounded-full border border-[#d8d5cb] px-4 py-2 text-sm font-medium text-[#526157] transition hover:border-[#b8c0b5] hover:bg-[#f8f5ef]">Modifier</Link>
              <Link href={`/recipes/${recipe.id}/history`} className="inline-flex min-h-10 items-center rounded-full border border-[#d8d5cb] px-4 py-2 text-sm font-medium text-[#526157] transition hover:border-[#b8c0b5] hover:bg-[#f8f5ef]">Historique</Link>
            </div>
            <DeleteRecipeButton id={recipe.id} />
          </div>
          {recipe.cooklang && <details className="border-t border-[#eeeae2] px-6 py-5 sm:px-10">
            <summary className="inline-flex cursor-pointer rounded-full border border-[#d8d5cb] px-4 py-2 text-sm font-medium text-[#526157] transition hover:bg-[#f8f5ef]">Voir brut</summary>
            <pre className="mt-4 overflow-x-auto rounded-xl bg-[#27352d] p-4 text-sm leading-6 text-white" aria-label="Recette au format Cooklang">{recipe.cooklang}</pre>
          </details>}
        </div>
      </article>
    </main>
  );
}
