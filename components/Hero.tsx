import { FlipWords } from "@/components/ui/flip-words";
import { Play } from "lucide-react";
import Link from "next/link";
import { oswald } from "@/components/ui/fonts";


export default function Hero() {
  const words = ["CANTAR", "VIVER", "AMAR", "REZAR"];

  return (
    <section className="flex flex-col items-center justify-center w-full h-[80vh] select-none gap-6 p-8">

      <h1 className={`flex flex-col items-center justify-center text-center font-light text-5xl md:text-7xl ${oswald.className}`}>
        <span>Bute lá</span>
        <FlipWords words={words} className="text-6xl md:text-8xl font-bold text-foreground"
        />
      </h1>
      <Link
        href="/songs"
        className="group flex w-full max-w-lg items-center justify-center gap-3 rounded-lg bg-primary p-2 text-lg font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary/80 hover:shadow-xl hover:shadow-primary/25 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px"
      >
        Bute
        <Play className="size-4 transition-transform group-hover:translate-x-1" />
      </Link>

    </section>);
}
