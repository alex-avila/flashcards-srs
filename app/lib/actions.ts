"use server"

import { redirect } from "next/navigation"
// TODO: figure out if revalidatePath is strictly necessary
import { revalidatePath } from "next/cache"
import { eq, sql, or } from "drizzle-orm"
import { signIn } from "@/auth"
import { AuthError } from "next-auth"
import { db } from "@/app/db"
import {
  decks,
  cards,
  deckSchema,
  cardSchema,
  SelectCard,
} from "@/app/db/schema"
import { kebabCase } from "./utils"
import { calculateSrs } from "./utils/srs"
import { auth } from "@/auth"

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

async function getSession() {
  const session = await auth()
  if (!session?.user) throw new Error("Session user not found")
  return session
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
  const parsed = deckSchema
    .pick({
      name: true,
      description: true,
      lessonsPerDay: true,
      lessonsBatchSize: true,
    })
    .safeParse(data)

  if (!parsed.success) {
    return {
      message: ACTION_MESSAGES.failedParsing,
      errors: parsed.error.issues.map(issue => issue.message),
    }
  }

  try {
    const { user } = await getSession()
    const pathname = kebabCase(parsed.data.name)
    const values: typeof decks.$inferInsert = {
      ...parsed.data,
      userId: user.id,
      pathname,
      srsTimingsType: pathname.includes("demo") ? "demo" : "default",
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
  const parsed = deckSchema
    .pick({
      name: true,
      description: true,
      lessonsPerDay: true,
      lessonsBatchSize: true,
    })
    .safeParse(data)

  if (!parsed.success) {
    return {
      message: ACTION_MESSAGES.failedParsing,
      errors: parsed.error.issues.map(issue => issue.message),
    }
  }

  try {
    const { user } = await getSession()
    const values: typeof decks.$inferInsert = {
      ...parsed.data,
      userId: user.id,
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
  deckPathname: string,
  prevState: ActionsState,
  formData: FormData
): Promise<ActionsState> | never {
  const data = {
    front: formData.get("front"),
    back: formData.get("back"),
    context: formData.get("context"),
  }
  const parsed = cardSchema
    .pick({ front: true, back: true, notes: true })
    .safeParse(data)

  if (!parsed.success) {
    return {
      message: ACTION_MESSAGES.failedParsing,
      errors: parsed.error.issues.map(issue => issue.message),
    }
  }

  try {
    const values: typeof cards.$inferInsert = {
      ...parsed.data,
      deckId,
    }

    await db.insert(cards).values(values)
  } catch (error) {
    console.error(error) // this would be logged to something like Sentry
    return {
      message: ACTION_MESSAGES.unexpected,
      ...(error instanceof Error && { errors: [error.message] }),
    }
  }

  revalidatePath(`/decks/${deckPathname}`)

  return {
    message: ACTION_MESSAGES.success,
    success: true,
  }
}

export async function editCard(
  deckId: number,
  deckPathname: string,
  cardId: number,
  prevState: ActionsState,
  formData: FormData
): Promise<ActionsState> | never {
  const data = {
    front: formData.get("front"),
    back: formData.get("back"),
    context: formData.get("context"),
  }
  const parsed = cardSchema
    .pick({ front: true, back: true, notes: true })
    .safeParse(data)

  if (!parsed.success) {
    return {
      message: ACTION_MESSAGES.failedParsing,
      errors: parsed.error.issues.map(issue => issue.message),
    }
  }

  try {
    const values: typeof cards.$inferInsert = {
      ...parsed.data,
      deckId,
    }

    await db.update(cards).set(values).where(eq(cards.id, cardId))
  } catch (error) {
    console.error(error) // this would be logged to something like Sentry
    return {
      message: ACTION_MESSAGES.unexpected,
      ...(error instanceof Error && { errors: [error.message] }),
    }
  }

  revalidatePath(`/decks/${deckPathname}`)

  return {
    message: ACTION_MESSAGES.success,
    success: true,
  }
}

export async function deleteCard(cardId: number, deckPathname: string) {
  try {
    await db.delete(cards).where(eq(cards.id, cardId))
    revalidatePath(`/decks/${deckPathname}`)
    return {
      message: ACTION_MESSAGES.success,
      success: true,
    }
  } catch (error) {
    console.error(error) // this would be logged to something like Sentry
    return {
      message: ACTION_MESSAGES.unexpected,
      ...(error instanceof Error && { errors: [error.message] }),
    }
  }
}

export async function setLearnedCards(
  srsTimingsType: string,
  learnedCards: SelectCard[]
) {
  const { srsTiming } = calculateSrs(srsTimingsType, 0, 0)

  if (!srsTiming) {
    throw new Error("No initial srs timing found")
  }

  const updates = {
    level: 1,
    learnedDate: sql`timezone('UTC', now())`,
    nextReviewDate: new Date(new Date().getTime() + srsTiming),
  }

  await db
    .update(cards)
    .set(updates)
    .where(
      learnedCards.length > 1
        ? or(...learnedCards.map(c => eq(cards.id, c.id)))
        : eq(cards.id, learnedCards[0].id)
    )
}

export async function updateCardSrs(
  srsTimingsType: string,
  card: SelectCard,
  incorrectCount: number
) {
  const { srsLevel, srsTiming, isMax } = calculateSrs(
    srsTimingsType,
    card.level,
    incorrectCount
  )

  const updates = {
    level: srsLevel,
    nextReviewDate: !srsTiming
      ? null
      : new Date(new Date().getTime() + srsTiming),
    retired: isMax,
  }

  await db.update(cards).set(updates).where(eq(cards.id, card.id))
}

export async function authenticate(
  prevState: ActionsState,
  formData: FormData
): Promise<ActionsState> {
  try {
    await signIn("credentials", formData)
    return { message: ACTION_MESSAGES.success, success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { message: "Invalid credentials." }
        default:
          return { message: "Something went wrong." }
      }
    }
    throw error
  }
}
