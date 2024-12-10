import { decks, cards } from "@/app/db/placeholder"
import { ReviewView } from "../../components/review-view"

interface ReviewsPageProps {
  params: Promise<{ deckId: string }>
}

export default async function ReviewsPage({ params }: ReviewsPageProps) {
  // on the server
  // fetch the cards for the deck in the 'deckId' param
  // filter to only get the ones that are due
  // (should actually only query for the ones that are due)
  // construct some sort of current reviews object to use in the javascript
  // so that the user can actually complete the review with whatever was available at the time
  // (e.g. if new cards become available for review while doing the reviews, don't consider them
  // ...when determining if the current session is done)

  // 1. TODO: query due cards for current deck from server also in random order
  const id = (await params).deckId
  const deck = decks.find(deck => deck.id === id)
  // TODO: handle scenario in which deck isn't found based on id param
  if (!deck) {
    throw "deck not found"
  }

  const dueCards = cards.filter(card => card.deck_id === deck.id)
  // .filter(card => card.next_review_date)
  return <ReviewView deckId={id} cards={dueCards} />
}
