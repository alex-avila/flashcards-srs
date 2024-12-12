import Link from "next/link"
import { fetchDecksForDashboard } from "@/app/lib/data"
import { Deck } from "./components/deck"
import { Button } from "@/app/components/ui/button"

export default async function DashboardPage() {
  const decks = await fetchDecksForDashboard()

  return (
    <section className="grid grid-cols-1 gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">all decks</h2>
        <Button asChild variant="link">
          <Link href="/decks/new">+ new deck</Link>
        </Button>
      </div>

      {decks.map(deck => (
        <Deck key={deck.id} deck={deck} />
      ))}
    </section>
  )
}
