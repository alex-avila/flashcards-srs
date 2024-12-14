import { useState, useMemo, useRef } from "react"
import { clsx } from "clsx"
import { Flashcard } from "@/app/components/ui/flashcard"
import { Progress } from "@/app/components/ui/progress"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { useSessionState } from "@/app/hooks/use-session-state"
import { SelectCard } from "@/app/db/schema"

type CardAndIndex = [SelectCard, number]
function* cardsGenerator(cards: SelectCard[]): Generator<CardAndIndex, void> {
  for (let i = 0; i < cards.length; i++) {
    yield [cards[i], i]
  }
}

function useCardSequence(cards: SelectCard[]) {
  // NOTE: unnecessary use of a generator function, but it works and I wanted to practice it
  const initialCard = useRef<CardAndIndex | null>(null)
  const getNextCard = useMemo(() => {
    // NOTE: this should never rerun b/c 'cards' shouldn't change,
    // ...but if they changed, currentCard should be set to initialCard again
    const gen = cardsGenerator(cards)
    initialCard.current = gen.next().value!
    return () => {
      const nextCard = gen.next().value
      return nextCard
    }
  }, [cards])

  return { getNextCard, initialCard: initialCard.current! }
}

interface SessionViewProps {
  deckId: number
  cards: SelectCard[]
  onEnd: () => void
}

export function ReviewSession({ cards, onEnd }: SessionViewProps) {
  if (!cards.length) {
    // TODO: actually handle this case
    throw new Error("no cards to review")
  }

  const {
    state: sessionState,
    dispatch: dispatchSessionState,
    isAnswered,
    isFinished,
  } = useSessionState({ phase: "interrogation" })

  const { getNextCard, initialCard } = useCardSequence(cards)

  const [currentCard, setCurrentCard] = useState(initialCard!)
  const [answer, setAnswer] = useState("")

  const resetForNextReview = (nextCard: CardAndIndex) => {
    setAnswer("")
    dispatchSessionState({ type: "START_NEXT" })
    setCurrentCard(nextCard)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isFinished) {
      onEnd()
      return
    }

    if (!isAnswered) {
      const isLast = Boolean(currentCard[1] >= cards.length - 1)
      const wasCorrect =
        currentCard[0].back.toLowerCase() === answer.trim().toLowerCase()

      dispatchSessionState({
        type: isLast ? "FINISH" : "ANSWER",
        wasCorrect,
      })
    } else {
      const nextCard = getNextCard()
      console.log("submit:nextCard", nextCard)
      if (nextCard) {
        resetForNextReview(nextCard)
      }
    }
  }

  const progress =
    ((currentCard[1] + (!isAnswered ? 0 : 1)) / cards.length) * 100

  return (
    <>
      <Progress value={progress} />
      <div className="mt-6 space-y-6">
        <Flashcard card={currentCard[0]} canFlip={false} flipped={isAnswered} />
        <form className="flex gap-2" onSubmit={handleSubmit}>
          <label htmlFor="answer-input" className="sr-only">
            Answer
          </label>
          <Input
            id="answer-input"
            className={`text-center ${clsx({
              "bg-green-500/20 focus-visible:ring-green-500":
                isAnswered && sessionState.wasCorrect,
              "bg-red-500/20 focus-visible:ring-red-500":
                isAnswered && !sessionState.wasCorrect,
            })}`}
            required
            autoCorrect="off"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck="false"
            value={answer}
            readOnly={isAnswered}
            onChange={event => setAnswer(event.target.value)}
          />
          <Button className="min-w-[6em]" type="submit">
            {isFinished ? "Finish!" : isAnswered ? "Next" : "Submit"}
          </Button>
        </form>
      </div>
    </>
  )
}
