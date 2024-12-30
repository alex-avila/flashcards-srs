import type { Metadata } from "next"
import { ReviewView } from "../../components/review-view"
import { fetchReviews } from "@/app/lib/data"

interface ReviewsPageProps {
  params: Promise<{ deckPathname: string }>
}

export async function generateMetadata({
  params,
}: ReviewsPageProps): Promise<Metadata> {
  const pathname = (await params).deckPathname
  const { deck } = await fetchReviews({ pathname })

  return { title: `Reviews - ${deck.name}` }
}

export default async function ReviewsPage({ params }: ReviewsPageProps) {
  const pathname = (await params).deckPathname
  const { deck, reviews } = await fetchReviews({ pathname })

  if (!deck) {
    return <div>Deck not found</div>
  }

  if (!reviews?.length) {
    return <div>No reviews for now</div>
  }

  return <ReviewView deckSrsTimingsType={deck.srsTimingsType} cards={reviews} />
}
