"use client"

import { useRouter } from "next/navigation"
import { Card } from "@/app/db/placeholder-schema"
import { ReviewSession } from "./review-session"

interface ReviewViewProps {
  deckId: string
  cards: Card[]
}

export function ReviewView({ deckId, cards }: ReviewViewProps) {
  const router = useRouter()

  return (
    <ReviewSession
      deckId={deckId}
      cards={cards}
      onEnd={() => router.push("/")}
    />
  )
}
