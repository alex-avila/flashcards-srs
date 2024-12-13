import { eq, count, sql } from "drizzle-orm"
import { db } from "@/app/db"
import { decks, cards } from "@/app/db/schema"

//export async function fetchDecksForDashboard(userId: (typeof users)["id"]) {
export async function fetchDecksForDashboard() {
  const firstUser = await db.query.users.findFirst()
  const cardCounts = db
    .select({
      deckId: cards.deckId,
      lessonsCount: count(sql`case when ${cards.level} = 0 then 1 end`).as(
        "lessons_count"
      ),
      reviewsCount: count(
        sql`case when ${cards.nextReviewDate} is not null and ${cards.nextReviewDate} <= current_timestamp then 1 end`
      ).as("reviews_count"),
    })
    .from(cards)
    .groupBy(cards.deckId)
    .as("cards_count")
  const result = await db
    .select({
      id: decks.id,
      name: decks.name,
      pathname: decks.pathname,
      description: decks.description,
      lessonsCount: sql<number>`coalesce(${cardCounts.lessonsCount}, 0)`,
      reviewsCount: sql<number>`coalesce(${cardCounts.reviewsCount}, 0)`,
    })
    .from(decks)
    .leftJoin(cardCounts, eq(decks.id, cardCounts.deckId))
    .where(eq(decks.userId, firstUser!.id))

  return result
}

export async function fetchDeckWithCards({ pathname }: { pathname: string }) {
  const firstUser = await db.query.users.findFirst()
  const deckWithCards = await db.query.decks.findFirst({
    where: (decks, { and, eq }) =>
      and(eq(decks.userId, firstUser!.id), eq(decks.pathname, pathname)),
    with: {
      cards: true,
    },
  })

  if (!deckWithCards) {
    throw new Error(`Deck with pathname "${pathname}" not found`)
  }

  const { cards, ...deck } = deckWithCards

  return [deck, cards] as [typeof deck, typeof cards]
}
