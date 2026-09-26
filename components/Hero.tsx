import { FlipWords } from "@/components/ui/flip-words";
import { Button } from "./ui/button";
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

        <Button size="lg" className ="w-[75%]">
            <Link href="/songs" className="flex flex-row items-center gap-2 text-lg">
            Bute <Play />
            </Link>
            </Button>  
      </section>);
}
