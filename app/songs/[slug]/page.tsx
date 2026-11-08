import type { Metadata } from "next";
import { Music2 } from "lucide-react";
import { notFound } from "next/navigation";
import { getSong, getSongSlugs } from "@/lib/songs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

type SongPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getSongSlugs();
}

export async function generateMetadata({ params }: SongPageProps): Promise<Metadata> {
  const { slug } = await params;
  const song = await getSong(slug);
  return {
    title: song ? `${song.title} | Bute` : "Música | Bute",
    description: song ? `Letra e acordes de ${song.title}.` : "Música do cancioneiro Bute.",
  };
}

export default async function SongPage({ params }: SongPageProps) {
  const { slug } = await params;
  const song = await getSong(slug);

  if (!song) {
    notFound();
  }

  return (
    <article className="min-h-[calc(100vh-80px)] bg-background p-5 md:p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 max-w-2xl">
          <Breadcrumb className="mb-4">
            <BreadcrumbList className="uppercase tracking-[0.2em]">
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/songs" />}>Bute</BreadcrumbLink>
              </BreadcrumbItem>
              {song.category && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink render={<Link href={`/songs?category=${encodeURIComponent(song.category)}`} />}>
                      {song.category}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-primary">{song.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <header className="flex flex-col gap-2">
            <h1 className="font-heading text-5xl leading-[0.8] tracking-tight md:text-7xl">{song.title}</h1>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-md text-muted-foreground">{song.author || "Autor desconhecido"}</p>
              {song.category && (
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                  {song.category}
                </span>
              )}
            </div>
          </header>
        </div>

        <div className="mt-10 space-y-5 rounded-3xl border border-border bg-card p-6 shadow-sm md:p-10">
          {song.lyrics.map((lyric, index) => (
            <div key={`${lyric.line}-${index}`} className="overflow-x-auto">
              <div className="min-w-max font-mono">
                <p className="whitespace-pre text-sm font-bold tracking-wide text-primary">{lyric.chords || "\u00a0"}</p>
                <p className="whitespace-pre text-xl leading-relaxed md:text-2xl">{lyric.line}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
