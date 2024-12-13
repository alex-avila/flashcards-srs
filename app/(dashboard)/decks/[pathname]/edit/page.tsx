import { decks } from "@/app/db/placeholder"
import { DeckForm } from "@/app/components/ui/deck-form"

export default async function EditDeckPage({
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

  return (
    <div>
      <h2 className="pb-5 font-bold">edit deck: {deck.name}</h2>
      <DeckForm
        deck={deck}
        submitLabel="update"
        submitPendingLabel="updating…"
      />
    </div>
  )
}
