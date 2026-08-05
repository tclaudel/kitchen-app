"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Recipe = {
  id: string;
  title: string;
  description: string | null;
  ingredients: string;
  prepTimeMinutes: number | null;
  cookTimeMinutes: number | null;
  servings: number | null;
  tags: string | null;
};

function parseList(value: string) {
  try {
    return JSON.parse(value) as string[];
  } catch {
    return [];
  }
}

function recipeTag(value: string | null) {
  const tags = value ? parseList(value) : [];
  return tags[0] ?? "Recette familiale";
}

export function RecipeLibrary({ recipes }: { recipes: Recipe[] }) {
  const [query, setQuery] = useState("");
  const filteredRecipes = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) return recipes;

    return recipes.filter((recipe) => {
      const searchableText = [
        recipe.title,
        recipe.description ?? "",
        ...parseList(recipe.ingredients),
      ].join(" ").toLocaleLowerCase();
      return searchableText.includes(normalizedQuery);
    });
  }, [query, recipes]);

  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#27352d]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <Link href="/recipes" className="font-serif text-xl font-semibold tracking-tight">
          Recettes <span className="text-[#d66b4c]">en famille</span>
        </Link>
        <span className="rounded-full border border-[#d8d5cb] px-3 py-1 text-xs font-medium text-[#718078]">
          Bibliothèque privée
        </span>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pt-16">
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#d66b4c]">Le carnet du foyer</p>
          <h1 className="font-serif text-5xl leading-[0.95] tracking-tight sm:text-7xl">Mes recettes</h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-[#718078]">Les recettes que l&apos;on aime, réunies au même endroit et prêtes à cuisiner.</p>
        </div>

        <div className="mt-10 flex max-w-3xl items-center gap-3 rounded-2xl border border-[#dedbd2] bg-white px-4 py-3 shadow-[0_12px_30px_rgba(45,54,45,0.06)]">
          <span aria-hidden="true" className="text-xl text-[#d66b4c]">⌕</span>
          <input
            aria-label="Rechercher une recette ou un ingrédient"
            className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[#a6aaa2]"
            placeholder="Rechercher une recette ou un ingrédient…"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && <button aria-label="Effacer la recherche" className="text-xl text-[#8d958c]" onClick={() => setQuery("")}>×</button>}
        </div>

        <div className="mt-14 flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-[#8b948b]">{query ? `${filteredRecipes.length} résultat${filteredRecipes.length === 1 ? "" : "s"}` : "Votre collection"}</p>
            <h2 className="mt-1 font-serif text-3xl">{query ? "Résultats de recherche" : "À refaire bientôt"}</h2>
          </div>
        </div>

        {filteredRecipes.length === 0 ? (
          <div className="mt-6 rounded-[1.75rem] border border-dashed border-[#cfcac0] bg-white/60 px-6 py-14 text-center">
            <p className="font-serif text-2xl">Aucune recette trouvée</p>
            <p className="mt-2 text-sm text-[#718078]">Essayez un autre titre ou ingrédient.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRecipes.map((recipe, index) => {
              const ingredients = parseList(recipe.ingredients);
              const duration = [recipe.prepTimeMinutes, recipe.cookTimeMinutes].reduce<number>((total, value) => total + (value ?? 0), 0);
              return (
                <Link key={recipe.id} href={`/recipes/${recipe.id}`} className="group overflow-hidden rounded-[1.75rem] border border-[#e1ded5] bg-white transition hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(45,54,45,0.1)]">
                  <div className={`flex h-48 items-center justify-center bg-gradient-to-br ${["from-orange-200 via-amber-100 to-yellow-50", "from-rose-200 via-orange-100 to-amber-50", "from-lime-200 via-emerald-50 to-teal-50"][index % 3]}`}>
                    <span aria-hidden="true" className="text-7xl transition group-hover:scale-110">{["🥕", "🍎", "🍋"][index % 3]}</span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3"><h3 className="font-serif text-2xl leading-tight">{recipe.title}</h3><span aria-hidden="true" className="pt-1 text-lg text-[#d66b4c]">↗</span></div>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#d66b4c]">{recipeTag(recipe.tags)}</p>
                    <p className="mt-2 text-sm font-medium text-[#526157]">{duration ? `${duration} min` : "Durée non renseignée"}{recipe.servings ? ` · ${recipe.servings} portions` : ""}</p>
                    <p className="mt-2 text-sm leading-6 text-[#7a847a]">{ingredients.slice(0, 3).join(", ")}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <Link href="/recipes/import" className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#27352d] px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-[#27352d]/10 transition hover:bg-[#3b4c40] sm:mx-auto sm:w-auto sm:px-7"><span className="text-xl leading-none">＋</span>Ajouter une recette par photo</Link>
      </section>
    </main>
  );
}
