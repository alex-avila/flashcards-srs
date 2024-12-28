import { LessonsView } from "../../components/lessons-view"
import { fetchLessons } from "@/app/lib/data"

interface LessonsPageProps {
  params: Promise<{ deckPathname: string }>
}

export default async function LessonsPage({ params }: LessonsPageProps) {
  const pathname = (await params).deckPathname
  const { deck, lessons } = await fetchLessons({ pathname })

  if (!deck) {
    return <div>Deck not found</div>
  }

  if (!lessons?.length) {
    return <div>No lessons for today</div>
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
