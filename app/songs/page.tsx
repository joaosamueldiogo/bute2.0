import type { Metadata } from "next";
import SongCatalog from "@/components/SongCatalog";
import { getSongs } from "@/lib/songs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Músicas | Bute",
  description: "Consulta o cancioneiro do Bute e encontra a música certa para cantar.",
};

type SongsPageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function SongsPage({ searchParams }: SongsPageProps) {
  const songs = await getSongs();
  const { category } = await searchParams;

  return (
    <section className="min-h-[calc(100vh-80px)] bg-background p-5 md:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <Breadcrumb className="mb-4">
            <BreadcrumbList className=" uppercase tracking-[0.2em]">
              <BreadcrumbItem>
                <BreadcrumbPage className="text-primary">Bute</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="font-heading text-5xl leading-[0.8] tracking-tight md:text-7xl">Cancioneiro</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Letras, acordes e canções. Tudo à distância de um clique. Encontra a música certa para cantar, em qualquer momento.
          </p>
        </div>
        <SongCatalog songs={songs} initialCategory={category} />
      </div>
    </section>
  );
}
