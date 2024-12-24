import { ReviewView } from "../../components/review-view"
import { fetchReviews } from "@/app/lib/data"

interface ReviewsPageProps {
  params: Promise<{ deckPathname: string }>
}

export default async function ReviewsPage({ params }: ReviewsPageProps) {
  const pathname = (await params).deckPathname
  const { deck, reviews } = await fetchReviews({ pathname })

  if (!deck) {
    return <div>deck not found</div>
  }

  if (!reviews?.length) {
    return <div>no reviews</div>
  }

  return <ReviewView deckSrsTimingsType={deck.srsTimingsType} cards={reviews} />
}
