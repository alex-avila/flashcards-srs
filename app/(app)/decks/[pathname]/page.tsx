import type { Metadata } from "next"
import { Suspense } from "react"
import { fetchDeck } from "@/app/lib/data"
import { DeckViewWrapper } from "./components/deck-view-wrapper"
import { DeckViewSkeleton } from "./components/deck-view-skeleton"

interface ViewDeckPageProps {
  params: Promise<{ pathname: string }>
}

// TODO: maybe don't wait on this generateMetadata to start rendering?
export async function generateMetadata({
  params,
}: ViewDeckPageProps): Promise<Metadata> {
  const pathname = (await params).pathname
  const deck = await fetchDeck({ pathname })

  return { title: deck.name }
}

export default async function ViewDeckPage({ params }: ViewDeckPageProps) {
  const pathname = (await params).pathname

  return (
    <Suspense fallback={<DeckViewSkeleton />}>
      <DeckViewWrapper pathname={pathname} />
    </Suspense>
  )
}
