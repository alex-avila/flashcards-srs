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
  // TODO: add actual links to dynamic route segments and stuff
  return (
    <Card key={deck.name}>
      <CardHeader>
        <CardTitle>
          <Link href={`/decks/${deck.pathname}`} className="underline">
            <h3>{deck.name}</h3>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="space-y-2 pb-3">
            <div>lessons: {deck.lessonsCount}</div>
            {deck.lessonsCount > 0 ? (
              <Button asChild>
                <Link href={`/lessons/${deck.id}`}>start lessons</Link>
              </Button>
            ) : (
              <div>no more lessons for today!</div>
            )}
          </div>
          <div className="space-y-2 border-t pt-3">
            <div>reviews: {deck.reviewsCount}</div>
            {deck.reviewsCount > 0 ? (
              <Button asChild>
                <Link href={`/reviews/${deck.id}`}>start reviews</Link>
              </Button>
            ) : (
              <div>no more reviews to do right now</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
