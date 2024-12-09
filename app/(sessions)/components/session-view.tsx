"use client"

import { useRouter } from "next/navigation"
import { useState, useMemo, useReducer, useCallback } from "react"
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

const initialSessionState = { phase: "interrogation" } as SessionStateState

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

type CardAndIndex = [Card, number]
let initialCard: CardAndIndex | null = null
function* cardsGenerator(cards: Card[]): Generator<CardAndIndex, void> {
  for (let i = 0; i < cards.length; i++) {
    yield [cards[i], i]
  }
}

interface SessionViewProps {
  deckId: string
  cards: Card[]
}

// TODO: maybe rethink the leveling system. to make sure we only ever have 5 levels,
// ...it could take more consecutive correct answers to reach a new level
// ...(e.g. 3 correct answers after level 2 to reach level 3)
export function SessionView({ deckId, cards }: SessionViewProps) {
  if (!cards.length) {
    // TODO: actually handle this case
    throw new Error("no cards to review")
  }

  const router = useRouter()

  // NOTE: unnecessary use of a generator function, but it works and I wanted to practice it
  const getNextCard = useMemo(() => {
    // NOTE: this should never rerun b/c 'cards' shouldn't change,
    // ...but if they changed, currentCard should be set to initialCard again
    const gen = cardsGenerator(cards)
    initialCard = gen.next().value!

    return () => gen.next().value
  }, [cards])

  const [sessionState, dispatchSessionState] = useReducer(
    sessionStateReducer,
    initialSessionState
  )
  const [currentCard, setCurrentCard] = useState(initialCard!)
  const [answer, setAnswer] = useState("")

  const notInterrogating = sessionState.phase !== "interrogation"
  const isFinished = sessionState.phase === "finished"

  const progress =
    ((currentCard[1] + (!notInterrogating ? 0 : 1)) / cards.length) * 100

  let buttonLabel = "Submit"
  if (isFinished) buttonLabel = "Finish!"
  if (notInterrogating) buttonLabel = "Next"

  const checkAnswer = useCallback(() => {
    // set to finish if we're checking the answer of the final card
    const isLast = Boolean(currentCard[1] >= cards.length - 1)
    dispatchSessionState({
      type: isLast ? "FINISH" : "ANSWER",
      wasCorrect:
        currentCard[0].back.toLowerCase() === answer.trim().toLowerCase(),
    })
  }, [currentCard, answer, cards])

  const resetForNextReview = useCallback((nextCard: CardAndIndex) => {
    setAnswer("")
    dispatchSessionState({ type: "START_NEXT" })
    setCurrentCard(nextCard)
  }, [])

  const nextReview = useCallback(() => {
    const nextCard = getNextCard()
    if (nextCard) {
      resetForNextReview(nextCard)
    }
  }, [getNextCard, resetForNextReview])

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      if (isFinished) {
        router.push("/")
        return
      }

      if (!notInterrogating) {
        checkAnswer()
      } else {
        nextReview()
      }
    },
    [router, checkAnswer, nextReview, isFinished, notInterrogating]
  )

  return (
    <>
      <Progress value={progress} />
      <div className="mt-6 space-y-6">
        <Flashcard
          card={currentCard[0]}
          canFlip={false}
          flipped={notInterrogating}
        />
        <form className="flex gap-2" onSubmit={handleSubmit}>
          <Input
            className={`text-center ${clsx({
              "bg-green-500/20 focus-visible:ring-green-500":
                notInterrogating && sessionState.wasCorrect,
              "bg-red-500/20 focus-visible:ring-red-500":
                notInterrogating && !sessionState.wasCorrect,
            })}`}
            required
            value={answer}
            readOnly={notInterrogating}
            onChange={event => setAnswer(event.target.value)}
          />
          <Button className="min-w-[6em]" type="submit">
            {buttonLabel}
          </Button>
        </form>
      </div>
    </>
  )
}
