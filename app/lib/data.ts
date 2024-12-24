import { eq, count, sql, and } from "drizzle-orm"
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
        sql`case when ${cards.nextReviewDate} is not null and ${cards.nextReviewDate} <= timezone('UTC', now()) then 1 end`
      ).as("reviews_count"),
      learnedTodayCount: count(
        sql`
          case when ${cards.learnedDate} is not null
          and ${cards.learnedDate} >= date_trunc('day', now(), 'America/New_York')
          and ${cards.learnedDate} < date_trunc('day', now() + interval '1 day', 'America/New_York')
          then 1 end
        `
      ).as("learned_today_count"),
    })
    .from(cards)
    .groupBy(cards.deckId)
    .as("cards_count")
  // TODO: consider using 'with update clause' mentioned in drizzle's docs to remove repetition in select
  // - source: https://orm.drizzle.team/docs/update#with-update-clause
  const result = await db
    .select({
      id: decks.id,
      name: decks.name,
      pathname: decks.pathname,
      description: decks.description,
      lessonsCount: sql<number>`greatest(least((${decks.lessonsPerDay} - ${cardCounts.learnedTodayCount}), ${cardCounts.lessonsCount}), 0)`,
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
      and(
        eq(decks.userId, firstUser!.id),
        eq(decks.pathname, decodeURIComponent(pathname))
      ),
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

export async function fetchDeck({ pathname }: { pathname: string }) {
  const firstUser = await db.query.users.findFirst()
  const deck = await db.query.decks.findFirst({
    where: (decks, { and, eq }) =>
      and(
        eq(decks.userId, firstUser!.id),
        eq(decks.pathname, decodeURIComponent(pathname))
      ),
  })

  if (!deck) {
    throw new Error(`Deck with pathname "${pathname}" not found`)
  }

  return deck
}

export async function fetchLessons({ pathname }: { pathname: string }) {
  const firstUser = await db.query.users.findFirst()
  const learnedTodayCount = db
    .select({
      deckId: cards.deckId,
      learnedTodayCount: count(
        sql`
          case when ${cards.learnedDate} is not null
          and ${cards.learnedDate} >= date_trunc('day', now(), 'America/New_York')
          and ${cards.learnedDate} < date_trunc('day', now() + interval '1 day', 'America/New_York')
          then 1 end
        `
      ).as("learned_today_count"),
    })
    .from(cards)
    .groupBy(cards.deckId)
    .as("ltc_sq")
  const [deckInfo] = await db
    .select({
      id: decks.id,
      pathname: decks.pathname,
      lessonsPerDay: decks.lessonsPerDay,
      lessonsBatchSize: decks.lessonsBatchSize,
      learnedTodayCount:
        sql<number>`coalesce(${learnedTodayCount.learnedTodayCount}, 0)`.mapWith(
          Number
        ),
      srsTimingsType: decks.srsTimingsType,
    })
    .from(decks)
    .leftJoin(learnedTodayCount, eq(decks.id, learnedTodayCount.deckId))
    .where(
      and(
        eq(decks.userId, firstUser!.id),
        eq(decks.pathname, decodeURIComponent(pathname))
      )
    )

  if (!deckInfo) {
    throw new Error(`Deck with pathname ${pathname} not found.`)
  }

  const todaysLessons = await db.query.cards.findMany({
    orderBy: sql.raw("random()"),
    limit: deckInfo.lessonsPerDay - deckInfo.learnedTodayCount,
    where: (cards, { eq, and }) =>
      and(eq(cards.deckId, deckInfo.id), eq(cards.level, 0)),
  })

  return { deck: deckInfo, lessons: todaysLessons }
}

export async function fetchReviews({ pathname }: { pathname: string }) {
  const firstUser = await db.query.users.findFirst()
  const deck = await db.query.decks.findFirst({
    columns: { id: true, srsTimingsType: true },
    where: (decks, { eq }) =>
      and(
        eq(decks.userId, firstUser!.id),
        eq(decks.pathname, decodeURIComponent(pathname))
      ),
  })

  if (!deck?.id) {
    throw new Error(`Deck with pathname ${pathname} not found.`)
  }

  const reviews = await db.query.cards.findMany({
    orderBy: sql.raw("random()"),
    where: (cards, { eq, and, sql, lte, gt }) =>
      and(
        eq(cards.deckId, deck.id),
        gt(cards.level, 0),
        lte(cards.nextReviewDate, sql`timezone('UTC', now())`)
      ),
  })

  return { deck, reviews }
}
