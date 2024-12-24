import { LessonsView } from "../../components/lessons-view"
import { fetchLessons } from "@/app/lib/data"

interface LessonsPageProps {
  params: Promise<{ deckPathname: string }>
}

export default async function LessonsPage({ params }: LessonsPageProps) {
  // on the server
  // fetch the cards for the deck in the 'deckPathname' param
  // filter to only get the ones that are due
  // (should actually only query for the ones that are due)
  // construct some sort of current reviews object to use in the javascript
  // so that the user can actually complete the review with whatever was available at the time
  // (e.g. if new cards become available for review while doing the reviews, don't consider them
  // ...when determining if the current session is done)

  const pathname = (await params).deckPathname
  const { deck, lessons } = await fetchLessons({ pathname })

  if (!deck) {
    return <div>deck not found</div>
  }

  if (!lessons?.length) {
    return <div>no lessons for today</div>
  }

  return (
    <LessonsView
      deckId={deck.id}
      deckSrsTimingsType={deck.srsTimingsType}
      lessonsBatchSize={deck.lessonsBatchSize}
      cardsToLearn={lessons}
    />
  )
}
