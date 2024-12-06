import { Sparkle } from "lucide-react"
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Card as CardSchema } from "@/app/db/schema"
import { useState } from "react"

export interface FlashcardProps {
  card: CardSchema
}

export function Flashcard({ card }: FlashcardProps) {
  const [view, setView] = useState<"front" | "back">("front")
  const flip = () => {
    setView(view === "front" ? "back" : "front")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex gap-1.5" aria-hidden>
          {[...new Array(card.level || 1).keys()].map((_, i) => (
            <div
              key={i}
              className="flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground"
            >
              <Sparkle className="size-3 fill-primary-foreground" />
            </div>
          ))}
        </div>
        <div className="sr-only">level: {card.level}</div>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-stretch">
        <div className="mb-3 w-48 rounded bg-primary p-6 text-primary-foreground">
          {view === "back" ? card.back : card.front}
        </div>
        <div className="mt-auto">
          <Button onClick={flip} variant="outline">
            flip
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
