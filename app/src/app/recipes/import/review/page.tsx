"use client";

import Link from "next/link";
import { useState } from "react";
import { saveRecipe } from "./actions";

function displayLines(items: string[] | undefined) {
  return (items ?? []).map((item) => item.replace(/\\n/g, "\n")).join("\n");
}

export default function ReviewRecipePage() {
  const [draft] = useState(() => {
    if (typeof window === "undefined") return null;
    const stored = sessionStorage.getItem("recipe-draft");
    return stored ? JSON.parse(stored) as { title: string; ingredients: string[]; steps: string[]; prepTimeMinutes?: number | null; cookTimeMinutes?: number | null; servings?: number | null } : null;
  });
  const [title, setTitle] = useState(draft?.title ?? "");
  const [ingredients, setIngredients] = useState(displayLines(draft?.ingredients));
  const [steps, setSteps] = useState(displayLines(draft?.steps));
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(draft?.prepTimeMinutes?.toString() ?? "");
  const [cookTimeMinutes, setCookTimeMinutes] = useState(draft?.cookTimeMinutes?.toString() ?? "");
  const [servings, setServings] = useState(draft?.servings?.toString() ?? "");

  if (!draft) {
    return (
      <main className="min-h-screen bg-[#f8f5ef] px-5 py-20 text-center text-[#27352d]">
        <h1 className="font-serif text-4xl">Aucune extraction à vérifier</h1>
        <Link href="/recipes/import" className="mt-6 inline-block rounded-full bg-[#27352d] px-5 py-3 text-sm font-semibold text-white">Photographier une recette</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#27352d]">
      <header className="mx-auto flex max-w-4xl items-center justify-between px-5 py-6 sm:px-8">
        <Link href="/recipes" className="font-serif text-xl font-semibold tracking-tight">Recettes <span className="text-[#d66b4c]">en famille</span></Link>
        <Link href="/recipes/import" className="text-sm font-medium text-[#718078]">Reprendre la photo</Link>
      </header>
      <section className="mx-auto max-w-4xl px-5 pb-16 pt-8 sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d66b4c]">Étape 2 · Vérification</p>
        <h1 className="mt-3 font-serif text-5xl leading-none tracking-tight sm:text-7xl">Relire la recette</h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-[#718078]">L&apos;extraction est prête. Corrigez ce qui doit l&apos;être avant de l&apos;ajouter à vos recettes.</p>

        <form action={saveRecipe} className="mt-10 space-y-6 rounded-[2rem] border border-[#e1ded5] bg-white p-6 sm:p-10">
          <label className="block"><span className="mb-2 block text-sm font-semibold">Titre</span><input name="title" value={title} onChange={(event) => setTitle(event.target.value)} className="w-full rounded-xl border border-[#d8d5cb] bg-[#fcfbf8] px-4 py-3 outline-none focus:border-[#d66b4c]" /></label>
          <label className="block"><span className="mb-2 block text-sm font-semibold">Ingrédients <span className="font-normal text-[#8b948b]">(un par ligne)</span></span><textarea name="ingredients" value={ingredients} onChange={(event) => setIngredients(event.target.value)} className="min-h-36 w-full rounded-xl border border-[#d8d5cb] bg-[#fcfbf8] px-4 py-3 outline-none focus:border-[#d66b4c]" /></label>
          <label className="block"><span className="mb-2 block text-sm font-semibold">Préparation <span className="font-normal text-[#8b948b]">(une étape par ligne)</span></span><textarea name="steps" value={steps} onChange={(event) => setSteps(event.target.value)} className="min-h-44 w-full rounded-xl border border-[#d8d5cb] bg-[#fcfbf8] px-4 py-3 outline-none focus:border-[#d66b4c]" /></label>
          <div className="grid gap-4 border-t border-[#eeeae2] pt-6 sm:grid-cols-3">
            <label className="block"><span className="mb-2 block text-sm font-semibold">Préparation (min)</span><input name="prepTimeMinutes" type="number" min="0" value={prepTimeMinutes} onChange={(event) => setPrepTimeMinutes(event.target.value)} className="w-full rounded-xl border border-[#d8d5cb] bg-[#fcfbf8] px-4 py-3 outline-none focus:border-[#d66b4c]" /></label>
            <label className="block"><span className="mb-2 block text-sm font-semibold">Cuisson (min)</span><input name="cookTimeMinutes" type="number" min="0" value={cookTimeMinutes} onChange={(event) => setCookTimeMinutes(event.target.value)} className="w-full rounded-xl border border-[#d8d5cb] bg-[#fcfbf8] px-4 py-3 outline-none focus:border-[#d66b4c]" /></label>
            <label className="block"><span className="mb-2 block text-sm font-semibold">Portions</span><input name="servings" type="number" min="1" value={servings} onChange={(event) => setServings(event.target.value)} className="w-full rounded-xl border border-[#d8d5cb] bg-[#fcfbf8] px-4 py-3 outline-none focus:border-[#d66b4c]" /></label>
          </div>
          <label className="block border-t border-[#eeeae2] pt-6"><span className="mb-2 block text-sm font-medium text-[#bd6045]">Signaler un problème d&apos;extraction <span className="font-normal text-[#8b948b]">(optionnel)</span></span><textarea name="incident" className="min-h-24 w-full rounded-xl border border-[#d8d5cb] bg-[#fcfbf8] px-4 py-3 outline-none focus:border-[#d66b4c]" placeholder="Décrivez une erreur ou une information manquante" /></label>
          <button className="w-full rounded-2xl bg-[#27352d] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#3b4c40]">Enregistrer la recette</button>
        </form>
      </section>
    </main>
  );
}
