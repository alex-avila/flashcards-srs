import "dotenv/config"
import bcrypt from "bcrypt"
import { db } from "."
import * as schema from "./schema"

async function main() {
  await seed()
}

async function seed() {
  const hashedPassword = await bcrypt.hash("12345", 10)
  const user: typeof schema.users.$inferInsert = {
    username: "rickdeckard",
    email: "rickdeckard@example.com",
    password: hashedPassword,
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
    },
    {
      deckId: newDeck.id,
      front: "猫 (ねこ)",
      back: "Cat",
      notes: "Popular animal",
    },
    {
      deckId: newDeck.id,
      front: "水 (みず)",
      back: "Water",
      notes: "Drinkable",
    },
    {
      deckId: newDeck.id,
      front: "空 (そら)",
      back: "Sky",
      notes: "Blue on a clear day",
    },
    {
      deckId: newDeck.id,
      front: "ありがとう",
      back: "Thank you",
      notes: "Polite expression",
    },
  ]
  await db.insert(schema.cards).values(cards).returning()
  console.log("new cards created")
}

main()
