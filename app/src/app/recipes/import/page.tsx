"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function ImportRecipePage() {
  const [source, setSource] = useState<"photo" | "text" | "url">("photo");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();

  const previewUrl = useMemo(() => file ? URL.createObjectURL(file) : "", [file]);

  function selectFile(selectedFile: File | null) {
    if (!selectedFile) return;
    const isImage = selectedFile.type.startsWith("image/") || /\.(png|jpe?g|webp|gif|heic|heif)$/i.test(selectedFile.name);
    if (!isImage) {
      setError("Choisissez une image au format JPG, PNG ou HEIC.");
      return;
    }
    setError("");
    setFile(selectedFile);
    setFileName(selectedFile.name);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) return;
    setIsProcessing(true);
    setError("");
    const data = new FormData();
    data.append("image", file);
    fetch("/api/recipes/ocr", { method: "POST", body: data })
      .then(async (response) => {
         const payload = await response.json() as { error?: string; title?: string; ingredients?: string[]; steps?: string[]; prepTimeMinutes?: number | null; cookTimeMinutes?: number | null; servings?: number | null };
        if (!response.ok) throw new Error(payload.error ?? "L'extraction a échoué.");
        sessionStorage.setItem("recipe-draft", JSON.stringify(payload));
        router.push("/recipes/import/review");
      })
      .catch((caughtError: unknown) => setError(caughtError instanceof Error ? caughtError.message : "L'extraction a échoué."))
      .finally(() => setIsProcessing(false));
  }

  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#27352d]">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-6 sm:px-8">
        <Link href="/recipes" className="font-serif text-xl font-semibold tracking-tight">Recettes <span className="text-[#d66b4c]">en famille</span></Link>
        <Link href="/recipes" className="text-sm font-medium text-[#718078]">Annuler</Link>
      </header>
      <section className="mx-auto max-w-3xl px-5 pb-16 pt-10 sm:px-8 sm:pt-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d66b4c]">Nouvelle recette</p>
        <h1 className="mt-3 font-serif text-5xl leading-none tracking-tight sm:text-7xl">Photographier une recette</h1>
        <div className="mt-5 flex items-center gap-3 text-sm text-[#718078]"><span className="flex size-7 items-center justify-center rounded-full bg-[#e9eee6] font-semibold text-[#526157]">1</span><span>Photographiez une page claire</span><span className="text-[#c7c6bd]">→</span><span className="flex size-7 items-center justify-center rounded-full bg-[#e9eee6] font-semibold text-[#526157]">2</span><span>Relisez et corrigez</span></div>

        <div className="mt-10 flex rounded-full border border-[#dedbd2] bg-white p-1">
          <button type="button" onClick={() => setSource("photo")} className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold transition ${source === "photo" ? "bg-[#27352d] text-white" : "text-[#718078]"}`}>Photo / scan</button>
          <button type="button" onClick={() => setSource("text")} className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold transition ${source === "text" ? "bg-[#27352d] text-white" : "text-[#718078]"}`}>Texte libre</button>
          <button type="button" onClick={() => setSource("url")} className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold transition ${source === "url" ? "bg-[#27352d] text-white" : "text-[#718078]"}`}>URL</button>
        </div>

        {source === "photo" ? <form onSubmit={handleSubmit} className="mt-4 rounded-[2rem] border border-dashed border-[#cfcac0] bg-white p-6 sm:p-10">
          <label htmlFor="recipe-photo" onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={(event) => { event.preventDefault(); setIsDragging(false); selectFile(event.dataTransfer.files?.[0] ?? null); }} className={`relative flex min-h-72 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl px-6 text-center transition ${isDragging ? "bg-[#e8efe4] ring-2 ring-[#d66b4c]" : "bg-[#f4f1e9] hover:bg-[#eeeae0]"}`}>
            {previewUrl ? <img src={previewUrl} alt="Aperçu de la recette sélectionnée" className="absolute inset-0 h-full w-full object-contain p-4" /> : <><span className="text-5xl" aria-hidden="true">📷</span><span className="mt-5 font-serif text-2xl">Déposez ou choisissez une photo</span><span className="mt-2 text-sm text-[#718078]">JPG, PNG ou HEIC · une recette par photo</span></>}
            {fileName && <span className="absolute bottom-4 max-w-[90%] truncate rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-[#526157] shadow-sm">{fileName}</span>}
            <input id="recipe-photo" className="sr-only" type="file" accept="image/*" capture="environment" onChange={(event) => selectFile(event.target.files?.[0] ?? null)} />
          </label>
          <button disabled={!file || isProcessing} className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#27352d] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#3b4c40] disabled:cursor-not-allowed disabled:bg-[#a9b0a7]">
            {isProcessing && <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />}
            {isProcessing ? "Lecture de la recette…" : file ? "Analyser cette photo" : "Choisir une photo pour continuer"}
          </button>
          {error && <p role="alert" className="mt-4 rounded-xl bg-[#fff0eb] px-4 py-3 text-sm text-[#a44f39]">{error}</p>}
        </form> : source === "text" ? <TextImport text={text} setText={setText} /> : <UrlImport url={url} setUrl={setUrl} />}
      </section>
    </main>
  );
}

function TextImport({ text, setText }: { text: string; setText: (value: string) => void }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!text.trim()) return;
    setIsProcessing(true);
    setError("");
    try {
      const response = await fetch("/api/recipes/parse-text", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
       const payload = await response.json() as { error?: string; title?: string; ingredients?: string[]; steps?: string[]; prepTimeMinutes?: number | null; cookTimeMinutes?: number | null; servings?: number | null };
      if (!response.ok) throw new Error(payload.error ?? "Le texte n'a pas pu être structuré.");
      sessionStorage.setItem("recipe-draft", JSON.stringify(payload));
      router.push("/recipes/import/review");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Le texte n'a pas pu être structuré.");
    } finally {
      setIsProcessing(false);
    }
  }

  return <form onSubmit={handleSubmit} className="mt-4 rounded-[2rem] border border-[#dedbd2] bg-white p-6 sm:p-10">
    <label className="block"><span className="mb-2 block font-serif text-2xl">Collez votre recette</span><span className="mb-4 block text-sm leading-6 text-[#718078]">Collez un texte libre, même mal structuré. Vous pourrez tout relire avant l&apos;enregistrement.</span><textarea value={text} onChange={(event) => setText(event.target.value)} placeholder={"Exemple : Poulet au citron\n4 cuisses de poulet\nCuire au four à 180 °C…"} className="min-h-64 w-full rounded-2xl border border-[#d8d5cb] bg-[#fcfbf8] px-4 py-4 leading-7 outline-none focus:border-[#d66b4c]" /></label>
    <button disabled={!text.trim() || isProcessing} className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#27352d] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#3b4c40] disabled:cursor-not-allowed disabled:bg-[#a9b0a7]">{isProcessing && <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />}{isProcessing ? "Structuration de la recette…" : "Structurer la recette"}</button>
    {error && <p role="alert" className="mt-4 rounded-xl bg-[#fff0eb] px-4 py-3 text-sm text-[#a44f39]">{error}</p>}
  </form>;
}

function UrlImport({ url, setUrl }: { url: string; setUrl: (value: string) => void }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsProcessing(true);
    setError("");
    try {
      const response = await fetch("/api/recipes/import-url", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
       const payload = await response.json() as { error?: string; title?: string; ingredients?: string[]; steps?: string[]; prepTimeMinutes?: number | null; cookTimeMinutes?: number | null; servings?: number | null };
      if (!response.ok) throw new Error(payload.error ?? "L'URL n'a pas pu être importée.");
      sessionStorage.setItem("recipe-draft", JSON.stringify(payload));
      router.push("/recipes/import/review");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "L'URL n'a pas pu être importée.");
    } finally {
      setIsProcessing(false);
    }
  }

  return <form onSubmit={handleSubmit} className="mt-4 rounded-[2rem] border border-[#dedbd2] bg-white p-6 sm:p-10">
    <label className="block"><span className="mb-2 block font-serif text-2xl">Importer depuis une URL</span><span className="mb-4 block text-sm leading-6 text-[#718078]">Collez le lien d&apos;une page de recette. Les informations seront extraites puis vérifiables.</span><input required type="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://exemple.com/ma-recette" className="w-full rounded-2xl border border-[#d8d5cb] bg-[#fcfbf8] px-4 py-4 outline-none focus:border-[#d66b4c]" /></label>
    <button disabled={!url.trim() || isProcessing} className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#27352d] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#3b4c40] disabled:cursor-not-allowed disabled:bg-[#a9b0a7]">{isProcessing && <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />}{isProcessing ? "Lecture de la page…" : "Importer la recette"}</button>
    {error && <p role="alert" className="mt-4 rounded-xl bg-[#fff0eb] px-4 py-3 text-sm text-[#a44f39]">{error}</p>}
  </form>;
}
