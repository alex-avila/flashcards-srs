"use server"

import { formSchema } from "./schemas"

export type State = {
  message?: string
  errors?: string
}

export async function createDeck(prevState: State, formData: FormData) {
  const data = Object.fromEntries(formData)
  const parsed = formSchema.safeParse(data)

  console.log(parsed)

  if (!parsed.success) {
    return {
      message: "invalid form data",
    }
  }

  return { message: "output", errors: "" }
}
