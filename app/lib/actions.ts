"use server"

import { redirect } from "next/navigation"
// TODO: figure out if revalidatePath is strictly necessary
import { revalidatePath } from "next/cache"
import { cardFormSchema, formSchema } from "./schemas"

const ACTION_MESSAGES = {
  success: "success",
  failedParsing: "Form data parsing failed.",
  unexpected: "Unexpected error. Please try again.",
}

export type ActionsState = {
  message: string
  success?: boolean
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
        message: ACTION_MESSAGES.failedParsing,
        errors: parsed.error.issues.map(issue => issue.message),
      }
    }
  } catch (error) {
    console.error(error) // this would be logged to something like Sentry
    return {
      message: ACTION_MESSAGES.unexpected,
    }
  }

  // TODO: connect to database and use real id
  const id = "deck-001"

  // redirect internally throws an error so it needs to be outside of catch block
  revalidatePath("/decks")
  redirect(`/decks/${id}`)
}

export async function editDeck(
  deckId: string,
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
        message: ACTION_MESSAGES.failedParsing,
        errors: parsed.error.issues.map(issue => issue.message),
      }
    }
  } catch (error) {
    console.error(error) // this would be logged to something like Sentry
    return {
      message: ACTION_MESSAGES.unexpected,
    }
  }

  // TODO: connect to database and use deckId
  //
  // redirect internally throws an error so it needs to be outside of catch block
  revalidatePath("/decks")
  redirect(`/decks/${deckId}`)
}

export async function createCard(
  deckId: string,
  prevState: ActionsState,
  formData: FormData
): Promise<ActionsState> | never {
  try {
    const data = {
      deck_id: deckId,
      front: formData.get("front"),
      back: formData.get("back"),
      context: formData.get("context"),
    }
    const parsed = cardFormSchema.safeParse(data)

    if (!parsed.success) {
      return {
        message: ACTION_MESSAGES.failedParsing,
        errors: parsed.error.issues.map(issue => issue.message),
      }
    }

    revalidatePath(`/decks/${deckId}`)

    return {
      message: ACTION_MESSAGES.success,
      success: true,
    }
  } catch (error) {
    console.error(error) // this would be logged to something like Sentry
    return {
      message: ACTION_MESSAGES.unexpected,
    }
  }
}

export async function editCard(
  deckId: string,
  cardId: string,
  prevState: ActionsState,
  formData: FormData
): Promise<ActionsState> | never {
  try {
    const data = {
      front: formData.get("front"),
      back: formData.get("back"),
      context: formData.get("context"),
    }
    const parsed = cardFormSchema.safeParse(data)

    if (!parsed.success) {
      return {
        message: ACTION_MESSAGES.failedParsing,
        errors: parsed.error.issues.map(issue => issue.message),
      }
    }

    // update card with cardId && deckId

    revalidatePath(`/decks/${deckId}`)

    return {
      message: ACTION_MESSAGES.success,
      success: true,
    }
  } catch (error) {
    console.error(error) // this would be logged to something like Sentry
    return {
      message: ACTION_MESSAGES.unexpected,
    }
  }
}
