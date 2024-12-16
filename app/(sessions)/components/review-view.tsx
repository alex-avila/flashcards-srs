"use client"

import { useRouter } from "next/navigation"
import { ReviewSession } from "./review-session"
import { SelectCard } from "@/app/db/schema"

interface ReviewViewProps {
  deckId: number
  cards: SelectCard[]
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
