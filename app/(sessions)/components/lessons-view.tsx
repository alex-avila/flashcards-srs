"use client"

import Link from "next/link"
import { useState, useMemo, useTransition } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog"
import { Button } from "@/app/components/ui/button"
import { LessonsSession } from "./lessons-session"
import { ReviewSession } from "./review-session"
import { SelectCard } from "@/app/db/schema"
import { setLearnedCards } from "@/app/lib/actions"

function shuffleCards(array: Array<SelectCard>) {
  const arrayCopy = [...array]
  for (let i = arrayCopy.length - 1; i > 0; i--) {
    // generate a random index
    const randomIndex = Math.floor(Math.random() * (i + 1))
    // swap the current element with the randomly chosen one
    ;[arrayCopy[i], arrayCopy[randomIndex]] = [
      arrayCopy[randomIndex],
      arrayCopy[i],
    ]
  }
  return arrayCopy
}

enum Mode {
  LEARN = "learn",
  REVIEW = "review",
  FINISH = "finish",
}

interface LessonsViewProps {
  deckId: number
  deckSrsTimingsType: string
  lessonsBatchSize: number
  cardsToLearn: SelectCard[]
}

export function LessonsView({
  deckId,
  deckSrsTimingsType,
  lessonsBatchSize,
  cardsToLearn,
}: LessonsViewProps) {
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

  const batchedCards = useMemo(() => batches[batchIndex], [batchIndex, batches])
  const isLastBatch = batchIndex === batches.length - 1

  const [isPending, startTransition] = useTransition()

  const finishBatch = () => {
    startTransition(async () => {
      try {
        await setLearnedCards(deckSrsTimingsType, batchedCards)
        setMode(Mode.FINISH)
      } catch (error) {
        // TODO: test error from setLearnedCards
        console.error(error)
        if (error instanceof Error) {
          alert(error.message)
        }
      }
    })
  }

  const goToNextBatch = () => {
    setBatchIndex(prev => prev + 1)
    setMode(Mode.LEARN)
  }

  return (
    <>
      {mode === Mode.LEARN ? (
        <LessonsSession
          deckId={deckId}
          cards={batchedCards}
          onEnd={() => setMode(Mode.REVIEW)}
        />
      ) : (
        <ReviewSession
          cards={shuffleCards(batchedCards)}
          onEnd={finishBatch}
          buttonDisabled={isPending}
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
                ? "Continue or go back to dashboard?"
                : "Go back to the dashboard?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-y-2">
            <Button asChild variant="secondary">
              <Link href="/dashboard">Back to dashboard</Link>
            </Button>
            {!isLastBatch && <Button onClick={goToNextBatch}>Continue</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
