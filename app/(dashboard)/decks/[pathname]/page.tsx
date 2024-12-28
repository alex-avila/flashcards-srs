import Link from "next/link"
import { DeckView } from "./components/deck-view"
import { Button } from "@/app/components/ui/button"
import { fetchDeckWithCards } from "@/app/lib/data"

interface ViewDeckPageProps {
  params: Promise<{ pathname: string }>
}

export default async function ViewDeckPage({ params }: ViewDeckPageProps) {
  const pathname = (await params).pathname

  try {
    const [deck, cards] = await fetchDeckWithCards({ pathname })

    return <DeckView deck={deck} cards={cards} />
  } catch {
    return (
      <>
        <div>
          Deck with pathname &ldquo;
          <span className="font-medium">{pathname}</span>&rdquo; not found
        </div>
        <Button className="mt-2" asChild>
          <Link href="/">Back to dashboard</Link>
        </Button>
      </>
    )
  }
}
