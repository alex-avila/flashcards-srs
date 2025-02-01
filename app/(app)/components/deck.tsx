import Link from "next/link"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { fetchDecksForDashboard } from "@/app/lib/data"

interface DeckProps {
  deck: Awaited<ReturnType<typeof fetchDecksForDashboard>>[number]
}

export function Deck({ deck }: DeckProps) {
  const pathnameNormalized = encodeURIComponent(deck.pathname)

  return (
    <Card key={deck.name}>
      <CardHeader>
        <CardTitle>
          <Link href={`/decks/${pathnameNormalized}`} className="underline">
            <h3>{deck.name}</h3>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="space-y-2 pb-3">
            {deck.lessonsCount > 0 ? (
              <>
                <div>{deck.lessonsCount} lessons</div>
                <Button asChild>
                  <Link href={`/lessons/${pathnameNormalized}`}>
                    Start lessons
                  </Link>
                </Button>
              </>
            ) : (
              <div>No more lessons for today.</div>
            )}
          </div>
          <div className="space-y-2 border-t pt-3">
            {deck.reviewsCount > 0 ? (
              <>
                <div>{deck.reviewsCount} reviews</div>
                <Button asChild>
                  <Link href={`/reviews/${pathnameNormalized}`}>
                    Start reviews
                  </Link>
                </Button>
              </>
            ) : (
              <div>No reviews are due right now.</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
