import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const decks = [
  {
    name: "katakana",
    cards: [
      {
        front: "ア",
        back: "a",
        level: 0,
        lastReviewed: null,
      },
    ],
  },
  {
    name: "geometry",
    cards: [],
  },
]

export default function Decks() {
  // TODO: add actual links to dynamic route segments and stuff
  return (
    <section className="grid grid-cols-1 gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">all decks</h2>
        <Link href="/" className="underline">
          + new deck
        </Link>
      </div>
      {decks.map(deck => {
        const lessonsCount = deck.cards.filter(
          card => card.lastReviewed === null
        ).length
        const reviewsCount = deck.cards.filter(
          card => card.lastReviewed !== null
        ).length

        return (
          <Card key={deck.name}>
            <CardHeader>
              <CardTitle>{deck.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div>
                  <div>lessons: {lessonsCount || 0}</div>
                  <Link href="/" className="underline">
                    start lessons
                  </Link>
                </div>
                <div>
                  <div>reviews: {reviewsCount || 0}</div>
                  <Link href="/" className="underline">
                    start reviews
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </section>
  )
}
