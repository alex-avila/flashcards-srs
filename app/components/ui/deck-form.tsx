"use client"

import { useActionState, useMemo } from "react"
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
import { Input } from "@/app/components/ui/input"
import { createDeck, editDeck, ActionsState } from "@/app/lib/actions"
// TODO: reconsider the location of formSchema
import { formSchema } from "@/app/lib/schemas"
import { Button } from "@/app/components/ui/button"
import { Deck } from "@/app/db/placeholder-schema"

const initialState: ActionsState = { message: "" }

// TODO: make this more generic to support editing a deck, not just creating one

// source: https://github.com/react-hook-form/react-hook-form/issues/10391
// this form creates a new deck and redirects to the deck page in which the user can create cards
export function DeckForm({
  deck,
  submitLabel = "submit",
  submitPendingLabel = "submitting…",
}: {
  deck?: Deck
  submitLabel: string
  submitPendingLabel: string
}) {
  const formDefaultValues = useMemo(
    () => ({
      name: deck?.name || "",
      description: deck?.description || "",
      lessonsPerDay: deck?.lessons_per_day || 15,
      lessonsBatchSize: deck?.lessons_batch_size || 5,
    }),
    [deck]
  )
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formDefaultValues,
  })

  const action = deck ? editDeck.bind(null, deck.id) : createDeck
  const [state, formAction, isPending] = useActionState(action, initialState)

  // TODO: show parsed errors that happen in the createDeck action due to failing parsing

  return (
    <Form {...form}>
      <form
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
              <FormLabel>name</FormLabel>
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
                description{" "}
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
              <FormLabel>lessons per day</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>
                goal for how many cards you wanna learn per day
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
              <FormLabel>lessons batch size</FormLabel>
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
                how many cards to learn per learn session
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="pt-2">
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
          <Button type="submit" disabled={isPending}>
            {!isPending ? submitLabel : submitPendingLabel}
          </Button>
          {/* TODO: add a delete button */}
        </div>
      </form>
    </Form>
  )
}
