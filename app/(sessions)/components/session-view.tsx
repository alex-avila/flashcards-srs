"use client"

import { useRouter } from "next/navigation"
import { useState, useMemo, useReducer } from "react"
import { clsx } from "clsx"
import { Card } from "@/app/db/schema"
import { Flashcard } from "@/app/components/ui/flashcard"
import { Progress } from "@/app/components/ui/progress"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"

interface SessionStateState {
  phase: "interrogation" | "answered" | "finished"
  wasCorrect?: boolean
}

type SessionStateAction =
  | { type: "START_NEXT" }
  | { type: "ANSWER"; wasCorrect: boolean }
  | { type: "FINISH"; wasCorrect: boolean }

// reducer manages data that we use to determine the UI states in a centralized place
// and provides minimal abstraction via actions types to simplify the logic in the component
function sessionStateReducer(
  state: SessionStateState,
  action: SessionStateAction
): SessionStateState {
  const { type } = action

  switch (type) {
    case "START_NEXT": {
      return { phase: "interrogation" }
    }
    case "ANSWER": {
      return { phase: "answered", wasCorrect: action.wasCorrect }
    }
    case "FINISH": {
      return { phase: "finished", wasCorrect: action.wasCorrect }
    }
    default: {
      throw new Error(`Unknown action type ${type}`)
    }
  }
}

function useSessionState(initialState: SessionStateState) {
  const [state, dispatch] = useReducer(sessionStateReducer, initialState)

  // helper variables
  const isAnswered = state.phase !== "interrogation"
  const isFinished = state.phase === "finished"

  return { state, dispatch, isAnswered, isFinished }
}

type CardAndIndex = [Card, number]
function* cardsGenerator(cards: Card[]): Generator<CardAndIndex, void> {
  for (let i = 0; i < cards.length; i++) {
    yield [cards[i], i]
  }
}

function useCardSequence(cards: Card[]) {
  // NOTE: unnecessary use of a generator function, but it works and I wanted to practice it
  const getNextCard = useMemo(() => {
    // NOTE: this should never rerun b/c 'cards' shouldn't change,
    // ...but if they changed, currentCard should be set to initialCard again
    const gen = cardsGenerator(cards)
    return () => gen.next().value
  }, [cards])

  const initialCard = useMemo(() => getNextCard()!, [getNextCard])

  return { getNextCard, initialCard }
}

interface SessionViewProps {
  deckId: string
  cards: Card[]
}

export function SessionView({ cards }: SessionViewProps) {
  if (!cards.length) {
    // TODO: actually handle this case
    throw new Error("no cards to review")
  }

  const router = useRouter()

  const {
    state: sessionState,
    dispatch: dispatchSessionState,
    isAnswered,
    isFinished,
  } = useSessionState({ phase: "interrogation" } as SessionStateState)

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
      router.push("/")
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
