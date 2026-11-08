"use client";

import { Search, Music2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { Song } from "@/lib/songs";
import SongCard from "./SongCard";
import MetadataEditor from "./MetadataEditor";

export default function SongCatalog({ songs, initialCategory = "Todas" }: { songs: Song[]; initialCategory?: string }) {
  const [query, setQuery] = useState("");
  const categories = [...new Set(songs.map((song) => song.category).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "pt"),
  );
  const filterCategories = ["Todas", ...categories];
  const [category, setCategory] = useState(
    filterCategories.includes(initialCategory) ? initialCategory : "Todas",
  );
  const authors = [...new Set(songs.map((song) => song.author).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "pt"),
  );

  const filteredSongs = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("pt");
    return songs.filter((song) => {
      const matchesCategory = category === "Todas" || song.category === category;
      const searchableText = `${song.title} ${song.author} ${song.category}`.toLocaleLowerCase("pt");
      return matchesCategory && searchableText.includes(normalizedQuery);
    });
  }, [category, query, songs]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row">
        <label className="relative block flex-1">
          <span className="sr-only">Pesquisar músicas</span>
          <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Pesquisar música"
            className="h-13 w-full rounded-2xl border border-border bg-background pl-12 pr-4 text-base shadow-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </label>
        <label className="md:w-56">
          <span className="sr-only">Filtrar por categoria</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-13 w-full appearance-none rounded-2xl border border-border bg-background px-4 text-base shadow-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
          >
            {filterCategories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {filteredSongs.length} {filteredSongs.length === 1 ? "música encontrada" : "músicas encontradas"}
      </p>

      {filteredSongs.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredSongs.map((song) => (
            <div key={song.slug} className="relative">
              {SongCard({ song })}
              <MetadataEditor song={song} categories={categories} authors={authors} />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
          <Music2 className="mx-auto size-10 text-primary/70" />
          <h2 className="mt-4 font-heading text-2xl">Não encontrámos essa música</h2>
          <p className="mt-2 text-muted-foreground">Tenta pesquisar por outro título ou escolhe outra categoria.</p>
        </div>
      )}
    </div>
  );
}
