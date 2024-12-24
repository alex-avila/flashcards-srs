import {
  DeckFormProvider,
  DeckForm,
  DeckFormSubmit,
} from "@/app/components/ui/deck-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"

// NOTE: could be a modal in the dashboard page, but it's good practice to see how to handle redirecting after for submissions
export default function NewDeckPage() {
  return (
    <Card className="mx-auto max-w-md space-y-3 md:mt-6">
      <CardHeader>
        <CardTitle>
          <h2>New deck</h2>
        </CardTitle>
        <CardDescription>
          Create a new deck. Include &ldquo;demo&rdquo; in the name to create a
          demo deck.
        </CardDescription>
      </CardHeader>
      <DeckFormProvider>
        <CardContent>
          <DeckForm />
        </CardContent>
        <CardFooter>
          <DeckFormSubmit submitLabel="create" submitPendingLabel="creating…" />
        </CardFooter>
      </DeckFormProvider>
    </Card>
  )
}
