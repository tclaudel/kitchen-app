import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function RecipeHistoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recipe = await prisma.recipe.findUnique({ where: { id }, include: { revisions: { orderBy: { createdAt: "desc" } } } });
  if (!recipe) notFound();
  return <main className="min-h-screen bg-[#f8f5ef] px-5 py-8 text-[#27352d] sm:px-8"><div className="mx-auto max-w-4xl"><Link href={`/recipes/${id}`} className="text-sm text-[#718078]">← Retour</Link><h1 className="mt-8 font-serif text-5xl">Historique des modifications</h1><div className="mt-8 space-y-5">{recipe.revisions.map((revision) => <details key={revision.id} className="rounded-2xl border bg-white p-5"><summary className="cursor-pointer font-semibold">{revision.createdAt.toLocaleString("fr-FR")} · {revision.title}</summary><pre className="mt-4 overflow-x-auto rounded-xl bg-[#27352d] p-4 text-sm text-white">{revision.cooklang ?? revision.steps}</pre></details>)}</div></div></main>;
}
