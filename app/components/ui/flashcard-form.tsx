import { usePathname } from "next/navigation"
import {
  useMemo,
  useEffect,
  useContext,
  createContext,
  useActionState,
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
  // FormDescription,
} from "@/app/components/ui/form"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { ActionsState, createCard, editCard } from "@/app/lib/actions"
import { useToast } from "@/app/hooks/use-toast"
import { SelectCard, cardSchema } from "@/app/db/schema"

const DEFAULT_FORM_ID = "flashcard-form"

interface FlashcardFormContextState {
  mode: "create" | "edit"
  card?: SelectCard
  formState: ActionsState
  formAction: (payload: FormData) => void
  formId: string
  isPending: boolean
}

const FlashcardFormContext = createContext<FlashcardFormContextState>({
  mode: "create",
  formState: { message: "" },
  formAction: () => {},
  formId: DEFAULT_FORM_ID,
  isPending: false,
})

interface FlashcardFormProviderProps {
  mode: "create" | "edit"
  deckId: number
  card?: SelectCard
  formId?: string
  children?: React.ReactNode
}

export function FlashcardFormProvider({
  mode,
  deckId,
  card,
  formId,
  children,
}: FlashcardFormProviderProps) {
  const pathname = usePathname()

  const action =
    mode === "edit"
      ? editCard.bind(null, deckId, pathname, card!.id)
      : createCard.bind(null, deckId, pathname)
  const [state, formAction, isPending] = useActionState(action, {
    message: "",
  } as ActionsState)

  return (
    <FlashcardFormContext.Provider
      value={{
        mode,
        card,
        formState: state,
        formAction,
        isPending,
        formId: formId || DEFAULT_FORM_ID,
      }}
    >
      {children}
    </FlashcardFormContext.Provider>
  )
}

function useFlashcardFormContext() {
  const context = useContext(FlashcardFormContext)
  if (!context) {
    throw new Error(
      "useFlashcardFormContext must be used within FlashcardFormProvider"
    )
  }
  return context
}

interface FlashcardFormFooterProps {
  submitLabel?: string
  submitPendingLabel?: string
}

export function FlashcardFormFooter({
  submitLabel = "submit",
  submitPendingLabel = "submitting…",
}: FlashcardFormFooterProps) {
  const { formState: state, formId, isPending } = useFlashcardFormContext()

  return (
    <div className="space-y-2">
      {!state.success && state.message && (
        <div className="pb-3 text-sm text-destructive">
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
      <Button form={formId} type="submit" disabled={isPending}>
        {!isPending ? submitLabel : submitPendingLabel}
      </Button>
    </div>
  )
}

interface FlashcardFormProps {
  onSubmitSuccess?: () => void
}

export function FlashcardForm({ onSubmitSuccess }: FlashcardFormProps) {
  const {
    mode,
    card,
    formId,
    formState: state,
    formAction,
  } = useFlashcardFormContext()

  // use useMemo to only recalculate this when card is updated
  const formDefaultValues = useMemo(
    () => ({
      front: card?.front || "",
      back: card?.back || "",
      // notes: card?.notes || "",
    }),
    [card]
  )
  const form = useForm<z.infer<typeof cardSchema>>({
    resolver: zodResolver(cardSchema),
    defaultValues: formDefaultValues,
  })

  const { toast } = useToast()

  useEffect(() => {
    if (state.success) {
      const { dismiss } = toast({
        description: (
          <div>
            <strong>{form.getValues("front")}</strong> card{" "}
            {card ? "edited" : "created"}
          </div>
        ),
      })

      setTimeout(dismiss, 5000)

      if (mode === "create") {
        form.setFocus("front")
        form.reset(formDefaultValues)
      }

      onSubmitSuccess?.()
    }
  }, [state, mode, card, toast, form, formDefaultValues, onSubmitSuccess])

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
          name="front"
          render={({ field }) => (
            <FormItem>
              <FormLabel>front</FormLabel>
              <FormControl>
                <Input autoFocus {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="back"
          render={({ field }) => (
            <FormItem>
              <FormLabel>back</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                context{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                any additional content (e.g. mnemonic devices)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}
      </form>
    </Form>
  )
}
