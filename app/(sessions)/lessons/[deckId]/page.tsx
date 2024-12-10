import { decks, cards } from "@/app/db/placeholder"
import { LessonsView } from "../../components/lessons-view"

interface LessonsPageProps {
  params: Promise<{ deckId: string }>
}

export default async function LessonsPage({ params }: LessonsPageProps) {
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

  // TODO: WHAT THE CODE MIGHT LOOK LIKE
  // // this would be done through an sql query
  // const lessonsPerDay = deck.lessons_per_day
  // const cardsLearnedToday = cards.reduce((sum, card) => {
  //   const learnedToday = card.learned_date === new Date().toISOString()
  //   return sum + (learnedToday ? 1 : 0)
  // }, 0)

  // // edge case if user manually navigates here
  // if (cardsLearnedToday >= lessonsPerDay) {
  //   // redirect or show error message or something
  // }

  // const cardsToLearn = cards
  //   .filter(card => !card.learned_date) // or 1970 or whatever

  const cardsToLearn = cards.filter(card => card.deck_id === id)
  return (
    <LessonsView
      deckId={deck.id}
      lessonsBatchSize={deck.lessons_batch_size}
      cardsToLearn={cardsToLearn}
    />
  )
}
