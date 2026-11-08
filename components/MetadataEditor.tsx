"use client";

import { Pencil, Save, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Song } from "@/lib/songs";

export default function MetadataEditor({
  song,
  categories,
  authors,
}: {
  song: Song;
  categories: string[];
  authors: string[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: song.title,
    author: song.author,
    category: song.category,
  });
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState("");

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  async function saveMetadata() {
    setStatus("saving");
    setError("");
    const response = await fetch(`/api/songs/${song.slug}/metadata`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      const result = (await response.json()) as { error?: string };
      setError(result.error ?? "Não foi possível guardar.");
      setStatus("error");
      return;
    }

    setOpen(false);
    setStatus("idle");
    router.refresh();
  }

  return (
    <div className={`pointer-events-none absolute inset-0 ${open ? "z-30" : "z-10"}`}>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="pointer-events-auto absolute -left-4 -top-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-background/90 px-3 py-1.5 text-xs font-semibold text-primary shadow-sm backdrop-blur transition hover:border-primary hover:bg-primary hover:text-primary-foreground"
          aria-label={`Editar metadata de ${song.title}`}
        >
          <Pencil className="size-3.5" />
          Editar
        </button>
      ) : (
        <div className="pointer-events-auto fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/45 p-4 pt-[12vh] backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-primary/30 bg-card p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Metadata</p>
                <p className="mt-1 text-sm text-muted-foreground">Editar informação da música</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Fechar editor">
                <X className="size-5 text-muted-foreground transition hover:text-foreground" />
              </button>
            </div>
            <div className="space-y-3">
              {(["title", "author", "category"] as const).map((field) => (
                <label key={field} className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {field === "title" ? "Título" : field === "author" ? "Autor" : "Categoria"}
                  <input
                    value={form[field]}
                    list={
                      field === "category"
                        ? `song-categories-${song.slug}`
                        : field === "author"
                          ? `song-authors-${song.slug}`
                          : undefined
                    }
                    onChange={(event) => setForm({ ...form, [field]: event.target.value })}
                    className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-normal normal-case tracking-normal outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                  {field === "category" && (
                    <datalist id={`song-categories-${song.slug}`}>
                      {categories.map((category) => (
                        <option key={category} value={category} />
                      ))}
                    </datalist>
                  )}
                  {field === "author" && (
                    <datalist id={`song-authors-${song.slug}`}>
                      {authors.map((author) => (
                        <option key={author} value={author} />
                      ))}
                    </datalist>
                  )}
                </label>
              ))}
            </div>
            {error && <p className="mt-3 text-xs text-destructive">{error}</p>}
            <button
              type="button"
              disabled={status === "saving"}
              onClick={saveMetadata}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
            >
              <Save className="size-4" />
              {status === "saving" ? "A guardar..." : "Guardar alterações"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
