"use client"

import { useActionState, createContext, useContext } from "react"
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
} from "@/app/components/ui/form"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { ActionsState, signup } from "@/app/lib/actions"
import { userSchema } from "@/app/db/schema"

interface SignupFormContextState {
  formId: string
  isPending: boolean
  formAction: (payload: FormData) => void
  formState: ActionsState
}

const SignupFormContext = createContext<SignupFormContextState>({
  isPending: false,
  formId: "signup-form",
  formAction: () => {},
  formState: { message: "" },
})

function useSignupForm() {
  const context = useContext(SignupFormContext)
  if (!context) {
    throw new Error("useSignupForm must be used within SignupFormProvider")
  }
  return context
}

interface SignupFormProviderProps {
  formId?: string
  children?: React.ReactNode
}

export function SignupFormProvider({
  formId = "signup-form",
  children,
}: SignupFormProviderProps) {
  const [state, formAction, isPending] = useActionState(signup, {
    message: "",
  } as ActionsState)

  return (
    <SignupFormContext.Provider
      value={{ isPending, formAction, formState: state, formId }}
    >
      {children}
    </SignupFormContext.Provider>
  )
}

interface SignupFormSubmitProps {
  submitLabel: string
  submitPendingLabel: string
}

export function SignupFormSubmit({
  submitLabel = "submit",
  submitPendingLabel = "submitting…",
}: SignupFormSubmitProps) {
  const { formId, isPending } = useSignupForm()

  return (
    <Button form={formId} type="submit" disabled={isPending}>
      {!isPending ? submitLabel : submitPendingLabel}
    </Button>
  )
}

// source: https://github.com/react-hook-form/react-hook-form/issues/10391
// this form creates a new deck and redirects to the deck page in which the user can create cards
export function SignupForm() {
  const { formId, formAction, formState: state } = useSignupForm()

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      password: "",
    },
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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>username</FormLabel>
              <FormControl>
                <Input autoComplete="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>password </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
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
