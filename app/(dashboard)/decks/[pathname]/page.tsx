import type { Metadata } from "next"
import Link from "next/link"
import { DeckView } from "./components/deck-view"
import { Button } from "@/app/components/ui/button"
import { fetchDeckWithCards } from "@/app/lib/data"

interface ViewDeckPageProps {
  params: Promise<{ pathname: string }>
}

export async function generateMetadata({
  params,
}: ViewDeckPageProps): Promise<Metadata> {
  const pathname = (await params).pathname
  const [deck] = await fetchDeckWithCards({ pathname })

  return { title: deck.name }
}

export default async function ViewDeckPage({ params }: ViewDeckPageProps) {
  const pathname = (await params).pathname

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
          <Link href="/">Back to dashboard</Link>
        </Button>
      </>
    )
  }
}
