"use server"

import { formSchema } from "./schemas"

export type State = {
  message?: string
  errors?: string | string[]
}

export async function createDeck(prevState: State, formData: FormData) {
  const data = Object.fromEntries(formData)
  console.log("data", data)
  const parsed = formSchema.safeParse(data)

  console.log("parsed:", JSON.stringify(parsed))

  if (!parsed.success) {
    return {
      message: "invalid form data",
      errors: parsed.error.issues.map(issue => issue.message),
    }
  }

  return { message: "success", errors: "" }
}
