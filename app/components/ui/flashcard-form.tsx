import { useActionState, useEffect, Fragment, useMemo } from "react"
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
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { ActionsState, createCard, editCard } from "@/app/lib/actions"
// TODO: reconsider the location of formSchema
import { cardFormSchema } from "@/app/lib/schemas"
import { useToast } from "@/app/hooks/use-toast"
import { SelectCard } from "@/app/db/schema"

interface FlashcardFormProps {
  deckId: number
  card?: SelectCard
  formId?: string
  onIsPendingUpdate?: (isPending: boolean) => void
  withSubmitButton?: boolean
  submitLabel?: string
  submitPendingLabel?: string
}

export function FlashcardForm({
  deckId,
  card,
  formId,
  onIsPendingUpdate,
  withSubmitButton = true,
  submitLabel = "submit",
  submitPendingLabel = "submitting…",
}: FlashcardFormProps) {
  // use useMemo to only recalculate this when card is updated
  const formDefaultValues = useMemo(
    () => ({
      front: card?.front || "",
      back: card?.back || "",
      context: card?.context || "",
    }),
    [card]
  )
  const form = useForm<z.infer<typeof cardFormSchema>>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: formDefaultValues,
  })

  const action = card
    ? editCard.bind(null, deckId, card.id)
    : createCard.bind(null, deckId)
  const [state, formAction, isPending] = useActionState(action, {
    message: "",
  } as ActionsState)

  const { toast } = useToast()

  useEffect(() => {
    if (onIsPendingUpdate) {
      onIsPendingUpdate(isPending)
    }
  }, [isPending, onIsPendingUpdate])

  useEffect(() => {
    if (state.success) {
      const { dismiss } = toast({
        description: (
          <div>
            <strong>{form.getValues("front")}</strong> card created
          </div>
        ),
      })

      setTimeout(dismiss, 5000)

      form.setFocus("front")
      form.reset(formDefaultValues)
    }
  }, [state, toast, form, formDefaultValues])

  const BottomWrapper = useMemo(
    () => (withSubmitButton ? "div" : Fragment),
    [withSubmitButton]
  )
  const bottomWrapperProps = useMemo(
    () => (withSubmitButton ? { className: "pt-2" } : {}),
    [withSubmitButton]
  )

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
        <FormField
          control={form.control}
          name="context"
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
        />
        <BottomWrapper {...bottomWrapperProps}>
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
          {withSubmitButton && (
            <Button type="submit" disabled={isPending}>
              {!isPending ? submitLabel : submitPendingLabel}
            </Button>
          )}
        </BottomWrapper>
      </form>
    </Form>
  )
}
