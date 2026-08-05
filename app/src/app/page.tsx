import Link from "next/link";

export default function Home() {
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
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#d66b4c]">
            Le carnet du foyer
          </p>
          <h1 className="font-serif text-5xl leading-[0.95] tracking-tight sm:text-7xl">
            Mes recettes
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-[#718078]">
            Les recettes que l&apos;on aime, réunies au même endroit et prêtes à cuisiner.
          </p>
        </div>

        <div className="mt-10 flex max-w-3xl items-center gap-3 rounded-2xl border border-[#dedbd2] bg-white px-4 py-3 shadow-[0_12px_30px_rgba(45,54,45,0.06)]">
          <span aria-hidden="true" className="text-xl text-[#d66b4c]">⌕</span>
          <input
            aria-label="Rechercher une recette ou un ingrédient"
            className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[#a6aaa2]"
            placeholder="Rechercher une recette ou un ingrédient…"
            type="search"
          />
          <kbd className="hidden rounded-lg bg-[#f2efe8] px-2 py-1 text-xs text-[#8d958c] sm:inline">⌘ K</kbd>
        </div>

        <div className="mt-14 flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-[#8b948b]">Votre collection</p>
            <h2 className="mt-1 font-serif text-3xl">À refaire bientôt</h2>
          </div>
          <button className="hidden rounded-full border border-[#cfd5ca] px-4 py-2 text-sm font-medium text-[#526157] transition hover:bg-white sm:block">
            Voir tout <span aria-hidden="true">→</span>
          </button>
        </div>

        <div className="mt-6 rounded-[1.75rem] border border-dashed border-[#cfcac0] bg-white/60 px-6 py-14 text-center">
          <p className="font-serif text-2xl">Ouvre la bibliothèque pour voir tes recettes</p>
          <Link href="/recipes" className="mt-5 inline-flex rounded-full bg-[#27352d] px-5 py-3 text-sm font-semibold text-white">Voir mes recettes</Link>
        </div>

        <button className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#27352d] px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-[#27352d]/10 transition hover:bg-[#3b4c40] sm:mx-auto sm:w-auto sm:px-7">
          <span className="text-xl leading-none">＋</span>
          Ajouter une recette par photo
        </button>
      </section>
    </main>
  );
}
