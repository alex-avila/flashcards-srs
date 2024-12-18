import { useState } from "react"
import { clsx } from "clsx"
import { Flashcard } from "@/app/components/ui/flashcard"
import { Progress } from "@/app/components/ui/progress"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { useSessionState } from "@/app/hooks/use-session-state"
import { SelectCard } from "@/app/db/schema"

type CardWithIncorrectCount = SelectCard & { incorrectCount?: number }

// kinda like a queue
function useCardsIterator(cards: SelectCard[]) {
  const [cardsToReview, setCardsToReview] = useState<CardWithIncorrectCount[]>([
    ...cards,
  ])
  const [currentCard, setCurrentCard] = useState(cardsToReview[0])

  const enqueue = () => {
    setCardsToReview(prev => {
      const cardsCopy = [...prev]
      const card = cardsCopy.shift()!
      cardsCopy.push(
        { ...card, incorrectCount: (card.incorrectCount ?? 0) + 1 }!
      )

      return cardsCopy
    })
  }

  const deque = () => {
    const card = cardsToReview[0]

    setCardsToReview(prev => {
      const cardsCopy = [...prev]
      cardsCopy.shift()!

      return cardsCopy
    })

    return card
  }

  return {
    cardsToReview: cardsToReview,
    currentCard,
    setNextCard: () => setCurrentCard(cardsToReview[0]),
    cardDeque: deque,
    cardReset: enqueue,
  }
}

interface ReviewSessionProps {
  cards: SelectCard[]
  onEnd: () => void
  onCorrect?: (card: SelectCard, incorrectCount: number) => void
  buttonDisabled: boolean
}

export function ReviewSession({
  cards,
  onEnd,
  onCorrect,
  buttonDisabled,
}: ReviewSessionProps) {
  const {
    state: sessionState,
    dispatch: dispatchSessionState,
    isAnswered,
    isFinished,
  } = useSessionState()

  const { cardsToReview, currentCard, setNextCard, cardDeque, cardReset } =
    useCardsIterator(cards)
  const [answer, setAnswer] = useState("")

  const resetForNextReview = () => {
    setNextCard()
    setAnswer("")
    dispatchSessionState({ type: "START_NEXT" })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isFinished) {
      onEnd()
      return
    }

    const isLast = cardsToReview.length === 1
    const wasCorrect =
      currentCard.back.toLowerCase().trim() === answer.toLowerCase().trim()

    if (!isAnswered) {
      dispatchSessionState({
        type: isLast && wasCorrect ? "FINISH" : "ANSWER",
        wasCorrect,
      })

      if (wasCorrect) {
        if (onCorrect) {
          const { incorrectCount, ...card } = cardDeque()
          onCorrect(card, incorrectCount || 0)
        } else {
          cardDeque()
        }
      } else {
        cardReset()
      }
    } else {
      resetForNextReview()
    }
  }

  return (
    <>
      <Progress
        value={((cards.length - cardsToReview.length) / cards.length) * 100}
      />
      <div className="mt-6 space-y-6">
        <Flashcard card={currentCard} canFlip={false} flipped={isAnswered} />
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
          <Button
            className="min-w-[6em]"
            type="submit"
            disabled={buttonDisabled}
          >
            {isFinished ? "Finish!" : isAnswered ? "Next" : "Submit"}
          </Button>
        </form>
      </div>
    </>
  )
}
