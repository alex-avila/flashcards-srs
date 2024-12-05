import { decks, cards } from "@/app/db/placeholder"
import DeckView from "@/app/components/ui/deck-view"

export default async function ViewDeckPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // TODO: this is gonna be a server action that gets decks and cards from the db
  const id = (await params).id
  const deck = decks.find(deck => deck.id === id)
  // TODO: handle scenario in which deck isn't found based on id param
  if (!deck) {
    throw "deck not found"
  }

  const deckCards = cards.filter(card => card.deck_id === deck.id)

  return (
    <div>
      {/* TODO: maybe rename component to something better */}
      <DeckView deckId={deck.id} deckName={deck.name} cards={deckCards} />
    </div>
  )
}
