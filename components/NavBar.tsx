import Link from "next/link";


export default function NavBar() {
  return (
    <nav className="flex flex-row items-center justify-between p-4 shadow-md bg-background">
        <Link href="/">
          <h1 className="font-extrabold text-3xl md:text-5xl">B</h1>
        </Link>
        <div className="flex flex-row gap-4">
          <Link href="/songs" className="text-medium">
            Músicas
          </Link>
         <Link href="/about" className="text-medium">
            Sobre
          </Link>
        </div>
    </nav>
  )
}
