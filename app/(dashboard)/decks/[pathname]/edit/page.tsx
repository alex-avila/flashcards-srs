import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { DeckForm } from "@/app/components/ui/deck-form"
import { fetchDeck } from "@/app/lib/data"

export default async function EditDeckPage({
  params,
}: {
  params: Promise<{ pathname: string }>
}) {
  const pathname = (await params).pathname

  try {
    const deck = await fetchDeck({ pathname })

    return (
      <div>
        <h2 className="pb-5 font-bold">edit deck: {deck.name}</h2>
        <DeckForm
          deck={deck}
          submitLabel="update"
          submitPendingLabel="updating…"
        />
      </div>
    )
  } catch {
    return (
      <>
        <div>
          deck with pathname &ldquo;
          <span className="font-medium">{pathname}</span>&rdquo; not found
        </div>
        <Button className="mt-2" asChild>
          <Link href="/">back to dashboard</Link>
        </Button>
      </>
    )
  }
}
