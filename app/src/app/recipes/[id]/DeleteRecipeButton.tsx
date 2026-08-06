"use client";

import { deleteRecipe } from "./actions";

export function DeleteRecipeButton({ id }: { id: string }) {
  return <form action={deleteRecipe} className="sm:border-l sm:border-[#eeeae2] sm:pl-4" onSubmit={(event) => { if (!window.confirm("Supprimer cette recette ?")) event.preventDefault(); }}>
    <input type="hidden" name="id" value={id} />
    <button type="submit" className="inline-flex min-h-10 w-full items-center justify-center rounded-full border border-[#e2b8aa] px-4 py-2 text-sm font-medium text-[#a44f39] transition hover:bg-[#fff0eb] sm:w-auto">Supprimer la recette</button>
  </form>;
}
