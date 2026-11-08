import type { Song } from "@/lib/songs";
import Link from "next/link";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "./ui/breadcrumb";

export default function SongCard({ song }: { song: Song }) {
    return (
        <Link
            key={song.slug}
            href={`/songs/${song.slug}`}
            className="group flex min-h-12 flex-col justify-between rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
        >
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="font-heading text-xl leading-tight">{song.title}</h2>
                    {song.category && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                            {song.category}
                        </span>)}
                </div>
                {song.author && (<div className="flex justify-between">

                    <p className="text-sm text-muted-foreground">
                        {song.author || "Autor desconhecido"}
                        {/* <span aria-hidden="true"> · </span>
                    {song.type} */}
                    </p>
                </div>)}


            </div>
        </Link>
    );
}