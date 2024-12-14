"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog"
import { Button } from "@/app/components/ui/button"
import { LessonsSession } from "./lessons-session"
import { ReviewSession } from "./review-session"
import { SelectCard } from "@/app/db/schema"

enum Mode {
  LEARN = "learn",
  REVIEW = "review",
  FINISH = "finish",
}

interface LessonsViewProps {
  deckId: number
  lessonsBatchSize: number
  cardsToLearn: SelectCard[]
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
      cardsToLearn.reduce<SelectCard[][]>((batches, card, index) => {
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
