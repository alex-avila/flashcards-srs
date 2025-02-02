import { fetchDecksForDashboard } from "@/app/lib/data"
import { Deck } from "../components/deck"

export async function Decks() {
  const decks = await fetchDecksForDashboard()

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(theme(columns.3xs),1fr))] gap-4">
      {decks.map(deck => (
        <Deck key={deck.id} deck={deck} />
      ))}
    </div>
  )
}
