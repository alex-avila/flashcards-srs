import { useState } from "react"
import { Card } from "@/app/db/schema"
import { Flashcard } from "@/app/components/ui/flashcard"
import { Progress } from "@/app/components/ui/progress"
import { Button } from "@/app/components/ui/button"

interface SessionViewProps {
  deckId: string
  cards: Card[]
  onEnd: () => void
}

export function LessonsSession({ cards, onEnd }: SessionViewProps) {
  if (!cards.length) {
    // TODO: actually handle this case
    throw new Error("no cards to review")
  }

  const [cardIndex, setCardIndex] = useState(0)
  const card = cards[cardIndex]
  const isLastCard = cardIndex === cards.length - 1

  const handleClick = () => {
    if (isLastCard) {
      onEnd()
      return
    }

    setCardIndex(prev => prev + 1)
  }

  const progress = ((cardIndex + 1) / cards.length) * 100

  return (
    <>
      <Progress value={progress} />
      <div className="mt-6 space-y-6">
        <Flashcard card={card} />
        <div className="mt-6 flex justify-center gap-2">
          <Button
            className="min-w-[6em]"
            disabled={cardIndex === 0}
            onClick={() => setCardIndex(prev => prev - 1)}
            variant="outline"
          >
            Previous
          </Button>
          <Button className="min-w-[6em]" onClick={handleClick}>
            {isLastCard ? "Finish!" : "Next"}
          </Button>
        </div>
      </div>
    </>
  )
}
