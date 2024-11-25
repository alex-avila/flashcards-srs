"use server"

import { redirect } from "next/navigation"
// TODO: figure out if revalidatePath is strictly necessary
import { revalidatePath } from "next/cache"
import { formSchema } from "./schemas"

export type ActionsState = {
  message: string
  errors?: string[]
}

export async function createDeck(
  prevState: ActionsState,
  formData: FormData
): Promise<ActionsState> | never {
  try {
    const data = {
      name: formData.get("name"),
      description: formData.get("description"),
      lessonsPerDay: formData.get("lessonsPerDay"),
      lessonsBatchSize: formData.get("lessonsBatchSize"),
    }
    const parsed = formSchema.safeParse(data)

    if (!parsed.success) {
      return {
        message: "Form data parsing failed.",
        errors: parsed.error.issues.map(issue => issue.message),
      }
    }
  } catch (error) {
    console.error(error) // this would be logged to something like Sentry
    return {
      message: "Unexpected error. Please try again.",
    }
  }

  // TODO: connect to database and use real id
  const id = "deck-001"

  // redirect internally throws an error so it needs to be outside of catch block
  revalidatePath("/decks")
  redirect(`/decks/${id}`)
}
