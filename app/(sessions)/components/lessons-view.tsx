"use client"

import { useState, useMemo } from "react"
import { Card } from "@/app/db/schema"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog"
import { LessonsSession } from "./lessons-session"
import { ReviewSession } from "./review-session"
import { Button } from "@/app/components/ui/button"
import Link from "next/link"

// for each deck make sure to only allow users to learn however many cards are specified in deck settings
// for each deck
// - check how many cards are left to learn today (learnLimit - cardsLearnedToday [card.learned_date])
// - if there are cards to review, randomize cards
// - create a batches based on the batchSize
// set to "learn" mode (will switch to "review" mode after)
// Give batch to SessionView or "learn" version of SessionView
// "Finish!" button switches to review mode (cards shuffled)
// After review show modal with option to go home or start next batch if possible

enum Mode {
  LEARN = "learn",
  REVIEW = "review",
  FINISH = "finish",
}

interface LessonsViewProps {
  deckId: string
  lessonsBatchSize: number
  cardsToLearn: Card[]
}

export function LessonsView({
  deckId,
  lessonsBatchSize,
  cardsToLearn,
}: LessonsViewProps) {
  // IMPORTANT: the use of a generator function in ReviewSession makes it important to memoize data
  // so that the generator instance is propertly memoized and won't be recreated unless necessary
  // NOTE: using a generator function to practice how that would work in React, unlikely to use it in production
  const batches = useMemo(
    () =>
      cardsToLearn.reduce<Card[][]>((batches, card, index) => {
        const batchIndex = Math.floor(index / lessonsBatchSize)
        if (!batches[batchIndex]) batches[batchIndex] = []
        batches[batchIndex].push(card)

        return batches
      }, []),
    [cardsToLearn, lessonsBatchSize]
  )

  const [batchIndex, setBatchIndex] = useState(0)
  const [mode, setMode] = useState<Mode>(Mode.LEARN)

  const goToNextBatch = () => {
    setBatchIndex(prev => prev + 1)
    setMode(Mode.LEARN)
  }

  const batchCards = useMemo(() => batches[batchIndex], [batchIndex, batches])
  const isLastBatch = batchIndex === batches.length - 1

  return (
    <>
      {mode === Mode.LEARN ? (
        <LessonsSession
          deckId={deckId}
          cards={batchCards}
          onEnd={() => setMode(Mode.REVIEW)}
        />
      ) : (
        <ReviewSession
          deckId={deckId}
          cards={batchCards}
          onEnd={() => setMode(Mode.FINISH)}
        />
      )}

      <Dialog
        open={mode === Mode.FINISH}
        onOpenChange={open => !open && setMode(Mode.REVIEW)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lessons batch finished!</DialogTitle>
            <DialogDescription>
              {!isLastBatch
                ? "Continue or go back to dashborad?"
                : "Go back to the dashboard?"}
            </DialogDescription>
            <div className="mx-auto mt-4 flex gap-2">
              <Button asChild variant="secondary">
                <Link href="/">Back to dashboard</Link>
              </Button>
              {!isLastBatch && (
                <Button onClick={goToNextBatch}>Continue</Button>
              )}
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}
