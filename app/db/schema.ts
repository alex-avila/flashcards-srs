import { sql, relations } from "drizzle-orm"
import {
  integer,
  pgTable,
  varchar,
  check,
  timestamp,
  unique,
} from "drizzle-orm/pg-core"
import { z } from "zod"

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 255 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
})

export const usersRelations = relations(users, ({ many }) => ({
  decks: many(decks),
}))

export type SelectUser = typeof users.$inferSelect

export const decks = pgTable(
  "decks",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .references(() => users.id)
      .notNull(),
    name: varchar({ length: 60 }).notNull(),
    pathname: varchar().notNull(),
    description: varchar(),
    lessonsPerDay: integer("lessons_per_day").default(15).notNull(),
    lessonsBatchSize: integer("lessons_batch_size").default(5).notNull(),
  },
  table => [
    {
      uniquePathnamesPerUser: unique("unique_pathnames_per_user").on(
        table.userId,
        table.pathname
      ),
      validLessonsPerDay: check(
        "valid_lessons_per_day",
        sql`${table.lessonsPerDay} >= 0 AND ${table.lessonsPerDay} < 101`
      ),
      validLessonsBatchSize: check(
        "valid_lessons_batch_size",
        sql`${table.lessonsBatchSize} >= 3 AND ${table.lessonsBatchSize} < 11`
      ),
    },
  ]
)

export const decksRelations = relations(decks, ({ one, many }) => ({
  user: one(users, { fields: [decks.userId], references: [users.id] }),
  cards: many(cards),
}))

export type SelectDeck = typeof decks.$inferSelect

export const deckSchema = z.object({
  userId: z.number(),
  name: z.string().min(1).max(60),
  pathname: z.string(),
  description: z.string().optional(),
  lessonsPerDay: z.coerce.number().min(1).max(100),
  lessonsBatchSize: z.coerce.number().min(3).max(10),
})

export const cards = pgTable(
  "cards",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    deckId: integer("deck_id").references(() => decks.id),
    front: varchar({ length: 55 }).notNull(),
    back: varchar({ length: 55 }).notNull(),
    notes: varchar().notNull(),
    level: integer().default(0),
    learnedDate: timestamp("learned_date", { mode: "date" }),
    // TODO: maybe update nextReviewDate with $onUpdate so that the database takes care of the srs kinda implicitly
    // - would also need a lastAnswerState ('correct', 'incorrect', null) to know how to update the nextReviewDate
    nextReviewDate: timestamp("next_review_date", { mode: "date" }),
    lastCorrectDate: timestamp("last_correct_date", { mode: "date" }),
    // maybe add more like 'lastIncorrectAnswerDate', 'consecutiveCorrectCount', 'internalLevel', etc.
  },
  table => [
    {
      validLevel: check("valid_level", sql`${table.level} > 0`),
    },
  ]
)

export const cardsRelations = relations(cards, ({ one }) => ({
  deck: one(decks, { fields: [cards.deckId], references: [decks.id] }),
}))

export type SelectCard = typeof cards.$inferSelect

export const cardSchema = z.object({
  deckId: z.number(),
  front: z.string().min(1).max(55),
  back: z.string().min(1).max(55),
  notes: z.string().optional(),
  level: z.number().min(0),
  learnedDate: z.date(),
  nextReviewDate: z.date(),
  lastCorrectDate: z.date(),
})
