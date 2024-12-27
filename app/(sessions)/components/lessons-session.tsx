import { useState } from "react"
import { Flashcard } from "@/app/components/ui/flashcard"
import { Button } from "@/app/components/ui/button"
import { SelectCard } from "@/app/db/schema"
import { ProgressWithHomeLink } from "./progress-with-home-link"

interface SessionViewProps {
  deckId: number
  cards: SelectCard[]
  onEnd: () => void
}

export function LessonsSession({ cards, onEnd }: SessionViewProps) {
  const [cardIndex, setCardIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const card = cards[cardIndex]
  const isLastCard = cardIndex === cards.length - 1

  const handleNext = () => {
    if (isLastCard) {
      onEnd()
      return
    }

    setFlipped(false)
    setCardIndex(prev => prev + 1)
  }

  const handlePrev = () => {
    setFlipped(false)
    setCardIndex(prev => prev - 1)
  }

  return (
    <>
      <ProgressWithHomeLink progress={((cardIndex + 1) / cards.length) * 100} />
      <div className="mt-6 space-y-6">
        <Flashcard card={card} flipped={flipped} onFlipped={setFlipped} />
        <div className="mt-6 flex justify-center gap-2">
          <Button
            className="min-w-[6em]"
            disabled={cardIndex === 0}
            onClick={handlePrev}
            variant="outline"
          >
            Previous
          </Button>
          <Button className="min-w-[6em]" onClick={handleNext}>
            {isLastCard ? "Finish!" : "Next"}
          </Button>
        </div>
      </div>
    </>
  )
}
