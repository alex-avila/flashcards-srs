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
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
// TODO: reconsider the name of the 'State'
import { createDeck, State } from "@/lib/actions"
// TODO: reconsider the placement of formSchema
import { formSchema } from "@/lib/schemas"
import { Button } from "@/components/ui/button"

const initialState: State = { message: "" }

// TODO: figure out a way to use react-hook-form while still using the progressive enhancement feature of server actions and the new form features
// source: https://github.com/react-hook-form/react-hook-form/issues/10391
export default function NewDeckForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
  })
  const [state, formAction, isPending] = useActionState(
    createDeck,
    initialState
  )

  return (
    <div>
      <h2 className="font-bold">New deck</h2>
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
              </FormItem>
            )}
          />
          <div className="pt-2">
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
