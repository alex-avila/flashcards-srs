import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { decks, cards } from "@/db/placeholder"

export default function Decks() {
  // TODO: add actual links to dynamic route segments and stuff
  return (
    <section className="grid grid-cols-1 gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">all decks</h2>
        <Button asChild variant="link">
          <Link href="/decks/new">+ new deck</Link>
        </Button>
      </div>
      {decks.map(deck => {
        const deckCards = cards.filter(card => card.deck_id === deck.id)
        const lessonsCount = deckCards.filter(
          card => card.last_correct_date === null
        ).length
        const reviewsCount = deckCards.filter(
          card => card.last_correct_date !== null
        ).length

        return (
          <Card key={deck.name}>
            <CardHeader>
              <CardTitle>
                <Link href={`/decks/${deck.id}`} className="underline">
                  <h3>{deck.name}</h3>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <div className="space-y-2 pb-3">
                  <div>lessons: {lessonsCount}</div>
                  {lessonsCount ? (
                    <Button asChild>
                      <Link href="/">start lessons</Link>
                    </Button>
                  ) : (
                    <div>no more lessons for today!</div>
                  )}
                </div>
                <div className="space-y-2 border-t pt-3">
                  <div>reviews: {reviewsCount}</div>
                  {reviewsCount ? (
                    <Button asChild>
                      <Link href="/">start reviews</Link>
                    </Button>
                  ) : (
                    <div>no more reviews to do right now</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </section>
  )
}
