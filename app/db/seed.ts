import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres"
import * as schema from "./schema"

export const db = drizzle<typeof schema>(process.env.DATABASE_URL!)

async function main() {
  await seed()
}

async function seed() {
  const user: typeof schema.users.$inferInsert = {
    username: "rickdeckard",
    email: "rickdeckard@example.com",
  }

  const [newUser] = await db.insert(schema.users).values(user).returning()
  console.log("New user created!")

  const deck: typeof schema.decks.$inferInsert = {
    userId: newUser.id,
    name: "Japanese Vocabulary",
    pathname: "japanese-vocabulary",
    description: "Some japanese vocabulary and hiragana and katakana",
  }
  const [newDeck] = await db.insert(schema.decks).values(deck).returning()
  console.log("New deck created!")

  const cards: Array<typeof schema.cards.$inferInsert> = [
    {
      deckId: newDeck.id,
      front: "犬 (いぬ)",
      back: "Dog",
      notes: "Common pet",
      level: 1,
    },
    {
      deckId: newDeck.id,
      front: "猫 (ねこ)",
      back: "Cat",
      notes: "Popular animal",
      level: 1,
    },
    {
      deckId: newDeck.id,
      front: "水 (みず)",
      back: "Water",
      notes: "Drinkable",
      level: 1,
    },
    {
      deckId: newDeck.id,
      front: "空 (そら)",
      back: "Sky",
      notes: "Blue on a clear day",
      level: 1,
    },
    {
      deckId: newDeck.id,
      front: "ありがとう",
      back: "Thank you",
      notes: "Polite expression",
      level: 1,
    },
  ]
  await db.insert(schema.cards).values(cards).returning()
  console.log("new cards created")
}

main()
