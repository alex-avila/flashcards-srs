"use client"

import { useActionState } from "react"
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
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
// TODO: reconsider the name of the 'State'
import { createDeck, State } from "@/lib/actions"
// TODO: reconsider the placement of formSchema
import { formSchema } from "@/lib/schemas"
import { Button } from "@/components/ui/button"

const initialState: State = { message: "" }

// source: https://github.com/react-hook-form/react-hook-form/issues/10391
export default function NewDeckForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", lessonsPerDay: 15, lessonsBatchSize: 5 },
  })
  const [state, formAction, isPending] = useActionState(
    createDeck,
    initialState
  )

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
          name="lessonsPerDay"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lessons per day</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
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
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="pt-2">
          <Button type="submit">Create</Button>
        </div>
      </form>
    </Form>
  )
}
