"use client"

import {
  useActionState,
  useMemo,
  createContext,
  useContext,
  useState,
} from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/app/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import {
  ActionsState,
  createDeck,
  deleteDeck,
  updateDeck,
} from "@/app/lib/actions"
import { SelectDeck, deckSchema } from "@/app/db/schema"

interface DeckFormContextState {
  deck?: SelectDeck
  formId: string
  isPending: boolean
  formAction: (payload: FormData) => void
  formState: ActionsState
}

const DeckFormContext = createContext<DeckFormContextState>({
  isPending: false,
  formId: "deck-form",
  formAction: () => {},
  formState: { message: "" },
})

function useDeckForm() {
  const context = useContext(DeckFormContext)
  if (!context) {
    throw new Error("useDeckForm must be used within DeckFormProvider")
  }
  return context
}

interface DeckFormProviderProps {
  deck?: SelectDeck
  formId?: string
  children?: React.ReactNode
}

export function DeckFormProvider({
  deck,
  formId = "deck-form",
  children,
}: DeckFormProviderProps) {
  const action = deck ? updateDeck.bind(null, deck.id) : createDeck
  const [state, formAction, isPending] = useActionState(action, {
    message: "",
  } as ActionsState)

  return (
    <DeckFormContext.Provider
      value={{ isPending, formAction, formState: state, deck, formId }}
    >
      {children}
    </DeckFormContext.Provider>
  )
}

interface DeckFormSubmitProps {
  submitLabel: string
  submitPendingLabel: string
  withDelete?: boolean
  deleteLabel?: string
  deletePendingLabel?: string
}

function DeckFormDelete({
  deckId,
  deleteLabel,
  deletePendingLabel,
}: {
  deckId: number
  deleteLabel?: string
  deletePendingLabel?: string
}) {
  const [open, setOpen] = useState(false)
  const [, formAction, isDeletePending] = useActionState(
    deleteDeck.bind(null, { deckId }),
    { message: "" }
  )

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        disabled={isDeletePending}
        onClick={() => setOpen(true)}
      >
        {!isDeletePending ? deleteLabel : deletePendingLabel}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete deck</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this deck?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <form action={formAction}>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={isDeletePending}
                >
                  {!isDeletePending ? deleteLabel : deletePendingLabel}
                </Button>
              </form>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function DeckFormSubmit({
  submitLabel = "Submit",
  submitPendingLabel = "Submitting…",
  deleteLabel = "Delete",
  deletePendingLabel = "Deleting…",
}: DeckFormSubmitProps) {
  const { formId, deck, isPending } = useDeckForm()

  return (
    <div className="flex gap-2">
      <Button form={formId} type="submit" disabled={isPending}>
        {!isPending ? submitLabel : submitPendingLabel}
      </Button>
      {deck && (
        <DeckFormDelete
          deckId={deck.id}
          deleteLabel={deleteLabel}
          deletePendingLabel={deletePendingLabel}
        />
      )}
    </div>
  )
}

// source: https://github.com/react-hook-form/react-hook-form/issues/10391
// this form creates a new deck and redirects to the deck page in which the user can create cards
export function DeckForm() {
  const { deck, formId, formAction, formState: state } = useDeckForm()

  const formDefaultValues = useMemo(
    () => ({
      name: deck?.name || "",
      description: deck?.description || "",
      lessonsPerDay: deck?.lessonsPerDay || 15,
      lessonsBatchSize: deck?.lessonsBatchSize || 5,
    }),
    [deck]
  )
  const form = useForm<z.infer<typeof deckSchema>>({
    resolver: zodResolver(deckSchema),
    defaultValues: formDefaultValues,
  })

  return (
    <Form {...form}>
      <form
        id={formId}
        action={formAction}
        onSubmit={async evt => {
          // trigger validation on all fields
          const isValid = await form.trigger(undefined, { shouldFocus: true })
          if (!isValid) {
            evt.preventDefault()
            return
          }
          // since it's valid and evt.preventDefault wasn't called, the submit will continue and run formAction
        }}
        className="space-y-3"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Description{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lessonsPerDay"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lessons per day</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>
                How many lessons to learn per day
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lessonsBatchSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lessons batch size</FormLabel>
              <Select
                name="lessonsBatchSize"
                onValueChange={field.onChange}
                defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a batch size" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[3, 4, 5, 6, 7, 8, 9].map(num => (
                    <SelectItem key={num} value={String(num)}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                How many cards to learn per lessons session
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {!state.success && state.message && (
          <div className="pb-3 pt-2 text-sm text-destructive">
            <div className="font-medium">{state.message}</div>
            {state.errors && (
              <ul className="list-disc ps-5 pt-0.5">
                {state.errors.map(error => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </form>
    </Form>
  )
}
