import Link from "next/link"

export function Footer() {
  return (
    <footer className="mx-4 border-t py-4 text-sm">
      <div className="flex items-center">
        <div>© 2025 Alex Avila</div>
        <div className="mx-3">/</div>
        <Link
          href="https://github.com/alex-avila"
          className="cursor-pointer underline underline-offset-4"
          target="_blank"
        >
          GitHub
        </Link>
        <div className="relative top-px mx-2 size-1 rounded-full bg-muted-foreground" />
        <Link
          href="https://github.com/alex-avila/flashcards-srs"
          className="cursor-pointer underline underline-offset-4"
          target="_blank"
        >
          Source code
        </Link>
      </div>
      <div className="pt-2">
        Built with Next.js, TypeScript, PostgreSQL, Drizzle ORM, Tailwind CSS,
        etc.
      </div>
    </footer>
  )
}
