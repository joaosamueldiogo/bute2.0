import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";
import { cn } from "@/lib/utils";
import { merriweatherHeading, oswald, roboto } from "@/components/ui/fonts";



export const metadata: Metadata = {
  title: "Bute",
  description: "Bute lá Cantar! Cancioneiro Projeto TAU. Paróquia de Santo António dos Olivais.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt"
      className={cn("h-full", "antialiased", roboto.variable, merriweatherHeading.variable, oswald.variable)}
    > 
      <body className="min-h-full bg-card">
        <NavBar />
        <main>
          {children}
        </main>   
      </body>
    </html>
  );
}
