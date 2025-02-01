import type { Metadata } from "next"
import Link from "next/link"
import { fetchDecksForDashboard } from "@/app/lib/data"
import { Deck } from "../components/deck"
import { Button } from "@/app/components/ui/button"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const decks = await fetchDecksForDashboard()

  return (
    <section className="grid grid-cols-1 gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">All decks</h2>
        <Button asChild variant="link">
          <Link href="/decks/new">+ New deck</Link>
        </Button>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(theme(columns.3xs),1fr))] gap-4">
        {decks.map(deck => (
          <Deck key={deck.id} deck={deck} />
        ))}
      </div>
    </section>
  )
}
