"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { ReviewSession } from "./review-session"
import { SelectCard } from "@/app/db/schema"
import { updateCardSrs } from "@/app/lib/actions"

interface ReviewViewProps {
  cards: SelectCard[]
  deckSrsTimingsType: string
}

export function ReviewView({ cards, deckSrsTimingsType }: ReviewViewProps) {
  const router = useRouter()

  const [isPending, startTransition] = useTransition()

  const updateCardSrsWithTransition = (
    card: SelectCard,
    incorrectCount: number
  ) => {
    startTransition(() => {
      updateCardSrs(deckSrsTimingsType, card, incorrectCount)
    })
  }

  return (
    <ReviewSession
      cards={cards}
      onCorrect={updateCardSrsWithTransition}
      onEnd={() => router.push("/dashboard")}
      buttonDisabled={isPending}
    />
  )
}
