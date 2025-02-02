import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { fetchDeckWithCards } from "@/app/lib/data"
import { DeckView } from "./deck-view"

export async function DeckViewWrapper({ pathname }: { pathname: string }) {
  try {
    const [deck, cards] = await fetchDeckWithCards({ pathname })

    const cardsSorted = cards.sort((a, b) => {
      const aDate = a.nextReviewDate ? new Date(a.nextReviewDate) : Infinity
      const bDate = b.nextReviewDate ? new Date(b.nextReviewDate) : Infinity

      return aDate === bDate ? 0 : aDate > bDate ? 1 : -1
    })

    return <DeckView deck={deck} cards={cardsSorted} />
  } catch {
    return (
      <>
        <div>
          Deck with pathname &ldquo;
          <span className="font-medium">{pathname}</span>&rdquo; not found
        </div>
        <Button className="mt-2" asChild>
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </>
    )
  }
}
