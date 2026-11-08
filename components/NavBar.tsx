import Link from "next/link";


export default function NavBar() {
  return (
    <nav className="relative z-10 flex flex-row items-center justify-between bg-background p-4 shadow-md">
      <Link href="/">
        <h1 className="font-extrabold text-3xl md:text-5xl">B</h1>
      </Link>
      <div className="flex flex-row gap-4">
        <Link href="/songs" className="text-medium transition-colors hover:text-primary">
          Músicas
        </Link>
        <Link href="/about" className="text-medium transition-colors hover:text-primary">
          Sobre
        </Link>
      </div>
    </nav>
  )
}
