"use client"

import { useState, useMemo, FormEvent } from "react"
import { Flashcard } from "@/app/components/ui/flashcard"
import { Progress } from "@/app/components/ui/progress"
import { Card } from "@/app/db/schema"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"

interface SessionViewProps {
  deckId: string
  cards: Card[]
}

enum MODES {
  interrogation = "interrogation",
  answeredCorrect = "answeredCorrect",
  answeredIncorrect = "answeredIncorrect",
  finished = "finished",
}

type ModesStrings = keyof typeof MODES

type CardAndIndex = [Card, number]
function* cardsGenerator(cards: Card[]): Generator<CardAndIndex, void> {
  for (let i = 0; i < cards.length; i++) {
    yield [cards[i], i]
  }
}

let initialCard: CardAndIndex | null = null

// TODO: maybe rethink the leveling system. to make sure we only ever have 5 levels,
// ...it could take more consecutive correct answers to reach a new level
// ...(e.g. 3 correct answers after level 2 to reach level 3)
export function SessionView({ deckId, cards }: SessionViewProps) {
  if (!cards.length) {
    // TODO: actually handle this case
    throw new Error("no cards to review")
  }

  // NOTE: unnecessary use of a generator function, but it works and I wanted to practice it
  const getNextCard = useMemo(() => {
    const gen = cardsGenerator(cards)
    initialCard = gen.next().value!

    return () => gen.next().value
  }, [cards])

  const [currentCard, setCurrentCard] = useState(initialCard!)
  const [answer, setAnswer] = useState("")
  const [mode, setMode] = useState<ModesStrings>("interrogation")

  const checkAnswer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // TODO: add feedback on input or whatever for either for these two options
    if (currentCard[0].back.toLowerCase() === answer.trim().toLowerCase()) {
      setMode(MODES.answeredCorrect)
    } else {
      // TODO: disable the input (b/c they can't change their answer at this point) and move focus to next button i guess
      setMode(MODES.answeredIncorrect)
    }
  }

  const resetForNextReview = (nextCard: CardAndIndex) => {
    setAnswer("")
    setMode(MODES.interrogation)
    setCurrentCard(nextCard)
  }

  const nextReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextCard = getNextCard()
    if (nextCard) {
      resetForNextReview(nextCard)
    }
  }

  const progress =
    ((currentCard[1] + (mode === MODES.interrogation ? 0 : 1)) / cards.length) *
    100

  // use 'as string[]' to make typescript happy
  const flipped = (
    [MODES.answeredCorrect, MODES.answeredIncorrect] as string[]
  ).includes(mode)

  return (
    <>
      <Progress value={progress} />
      <div className="mt-6 space-y-4">
        <Flashcard card={currentCard[0]} canFlip={false} flipped={flipped} />
        <form
          className="flex gap-2"
          onSubmit={event =>
            mode === MODES.interrogation
              ? checkAnswer(event)
              : nextReview(event)
          }
        >
          <Input
            required
            value={answer}
            onChange={event => setAnswer(event.target.value)}
          />
          <Button type="submit" variant="outline">
            {mode === MODES.interrogation ? "Submit" : "Next"}
          </Button>
        </form>
      </div>
    </>
  )
}
