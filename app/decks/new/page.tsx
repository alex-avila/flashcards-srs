import { DeckForm } from "@/app/components/ui/deck-form"

export default function NewDeck() {
  return (
    <div>
      <h2 className="pb-5 font-bold">create a new deck</h2>
      <DeckForm submitLabel="create" submitPendingLabel="creating…" />
    </div>
  )
}
