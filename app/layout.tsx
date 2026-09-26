import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bute",
  description: "Bute lá Cantar! Cancioneiro Projeto TAU. Paróquia de Santo António dos Olivais.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt"
      className={`${roboto.variable} h-full antialiased`}
    > 
      <body className="min-h-full">
        <NavBar />
        <main>
          {children}
        </main>   
      </body>
    </html>
  );
}
