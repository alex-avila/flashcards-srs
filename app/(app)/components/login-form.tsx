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
import { ActionsState, authenticate } from "@/app/lib/actions"
import { userSchema } from "@/app/db/schema"

interface LoginFormContextState {
  formId: string
  isPending: boolean
  formAction: (payload: FormData) => void
  formState: ActionsState
}

const LoginFormContext = createContext<LoginFormContextState>({
  isPending: false,
  formId: "login-form",
  formAction: () => {},
  formState: { message: "" },
})

function useLoginForm() {
  const context = useContext(LoginFormContext)
  if (!context) {
    throw new Error("useLoginForm must be used within LoginFormProvider")
  }
  return context
}

interface LoginFormProviderProps {
  formId?: string
  children?: React.ReactNode
}

export function LoginFormProvider({
  formId = "login-form",
  children,
}: LoginFormProviderProps) {
  const [state, formAction, isPending] = useActionState(authenticate, {
    message: "",
  } as ActionsState)

  return (
    <LoginFormContext.Provider
      value={{ isPending, formAction, formState: state, formId }}
    >
      {children}
    </LoginFormContext.Provider>
  )
}

interface LoginFormSubmitProps {
  submitLabel: string
  submitPendingLabel: string
}

export function LoginFormSubmit({
  submitLabel = "submit",
  submitPendingLabel = "submitting…",
}: LoginFormSubmitProps) {
  const { formId, isPending } = useLoginForm()

  return (
    <Button form={formId} type="submit" disabled={isPending}>
      {!isPending ? submitLabel : submitPendingLabel}
    </Button>
  )
}

// source: https://github.com/react-hook-form/react-hook-form/issues/10391
// this form creates a new deck and redirects to the deck page in which the user can create cards
export function LoginForm() {
  const { formId, formAction, formState: state } = useLoginForm()

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
              <FormLabel>Username</FormLabel>
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
              <FormLabel>Password</FormLabel>
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
