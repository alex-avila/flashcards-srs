import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import {
  DeckFormProvider,
  DeckForm,
  DeckFormSubmit,
} from "../../../components/deck-form"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import { fetchDeck } from "@/app/lib/data"

export default async function DeckSettingsPage({
  params,
}: {
  params: Promise<{ pathname: string }>
}) {
  const pathname = (await params).pathname

  try {
    const deck = await fetchDeck({ pathname })

    return (
      <Card className="mx-auto max-w-md space-y-3 md:mt-6">
        <CardHeader>
          <CardTitle>
            <h2>{deck.name} – Settings</h2>
          </CardTitle>
        </CardHeader>
        <DeckFormProvider deck={deck}>
          <CardContent>
            <DeckForm />
          </CardContent>
          <CardFooter>
            <DeckFormSubmit
              submitLabel="Update"
              submitPendingLabel="Updating…"
              deleteLabel="Delete"
              deletePendingLabel="Deleting…"
            />
          </CardFooter>
        </DeckFormProvider>
      </Card>
    )
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
