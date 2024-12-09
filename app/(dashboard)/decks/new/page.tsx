import { DeckForm } from "@/app/components/ui/deck-form"

// NOTE: could be a modal in the dashboard page, but it's good practice to see how to handle redirecting after for submissions
export default function NewDeckPage() {
  return (
    <div>
      <h2 className="pb-5 font-bold">create a new deck</h2>
      <DeckForm submitLabel="create" submitPendingLabel="creating…" />
    </div>
  )
}
