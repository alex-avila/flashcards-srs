"use server"

import { redirect } from "next/navigation"
// TODO: figure out if revalidatePath is strictly necessary
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { db } from "@/app/db"
import { decks, insertDeckSchema, updateDeckSchema } from "@/app/db/schema"
import { cardFormSchema } from "./schemas"
import { kebabCase } from "./utils"

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

function handleRedirect(
  type: "create_deck" | "edit_deck" | "delete_deck",
  redirectPath: string
): never {
  revalidatePath("/")

  if (type === "edit_deck") {
    revalidatePath(redirectPath)
  }

  // redirect internally throws an error so it needs to be outside of catch block
  redirect(redirectPath)
}

export async function createDeck(
  prevState: ActionsState,
  formData: FormData
): Promise<ActionsState> | never {
  let insertedPathname: string | null = null

  const data = {
    name: formData.get("name"),
    description: formData.get("description"),
    lessonsPerDay: formData.get("lessonsPerDay"),
    lessonsBatchSize: formData.get("lessonsBatchSize"),
  }
  const parsed = insertDeckSchema
    .pick({
      name: true,
      description: true,
      lessonsPerDay: true,
      lessonsBatchSize: true,
    })
    .safeParse({
      ...data,
      lessonsPerDay: Number(data.lessonsPerDay),
      lessonsBatchSize: Number(data.lessonsBatchSize),
    })

  if (!parsed.success) {
    console.log("parsed errors", parsed.error.issues)
    return {
      message: ACTION_MESSAGES.failedParsing,
      errors: parsed.error.issues.map(issue => issue.message),
    }
  }

  try {
    // TODO: get rid of this query after implementing auth
    const firstUser = await db.query.users.findFirst()
    const values: typeof decks.$inferInsert = {
      ...parsed.data,
      userId: firstUser!.id,
      pathname: kebabCase(parsed.data.name),
    }

    ;[{ insertedPathname }] = await db
      .insert(decks)
      .values(values)
      .returning({ insertedPathname: decks.pathname })
  } catch (error) {
    console.error(error) // this would be logged to something like Sentry
    return {
      message: ACTION_MESSAGES.unexpected,
      ...(error instanceof Error && { errors: [error.message] }),
    }
  }

  handleRedirect("create_deck", `/decks/${insertedPathname}`)
}

export async function updateDeck(
  deckId: number,
  prevState: ActionsState,
  formData: FormData
): Promise<ActionsState> | never {
  let updatedPathname: string | null = null

  const data = {
    name: formData.get("name"),
    description: formData.get("description"),
    lessonsPerDay: formData.get("lessonsPerDay"),
    lessonsBatchSize: formData.get("lessonsBatchSize"),
  }
  const parsed = updateDeckSchema.safeParse({
    ...data,
    lessonsPerDay: Number(data.lessonsPerDay),
    lessonsBatchSize: Number(data.lessonsBatchSize),
  })

  if (!parsed.success) {
    return {
      message: ACTION_MESSAGES.failedParsing,
      errors: parsed.error.issues.map(issue => issue.message),
    }
  }

  try {
    // TODO: get rid of this query after implementing auth
    const firstUser = await db.query.users.findFirst()
    const values: typeof decks.$inferInsert = {
      ...parsed.data,
      userId: firstUser!.id,
      pathname: kebabCase(parsed.data.name),
    }

    ;[{ updatedPathname }] = await db
      .update(decks)
      .set(values)
      .where(eq(decks.id, deckId))
      .returning({ updatedPathname: decks.pathname })
  } catch (error) {
    console.error(error) // this would be logged to something like Sentry
    return {
      message: ACTION_MESSAGES.unexpected,
    }
  }

  // redirect internally throws an error so it needs to be outside of catch block
  handleRedirect("edit_deck", `/decks/${updatedPathname}`)
}

export async function deleteDeck({
  deckId,
}: {
  deckId: number
}): Promise<ActionsState> | never {
  try {
    await db.delete(decks).where(eq(decks.id, deckId))
  } catch (error) {
    return {
      message: "Database error: Failed to delete deck",
      // TODO: check what an error from drizzle looks like and if the next line works
      ...(error instanceof Error && { errors: [error.message] }),
    }
  }

  handleRedirect("delete_deck", "/")
}

export async function createCard(
  deckId: number,
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
  deckId: number,
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
