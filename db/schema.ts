// sample data for now, will connect using drizzle and something like neon or supabase later
export type User = {
  id: string
  username: string
  password: string
  email?: string
  created_at: string
}

export type Deck = {
  id: string
  name: string
  description?: string
  lessons_per_day: number
  lessons_batch_size: number
  user_id: string
}

// remember that this should basically represent like a vocab word and info
export type Card = {
  id: string
  deck_id: string
  front: string
  back: string
  context: string
  level: number
  last_correct_date: string | null
  next_review_date: string | null
  learned_date: string | null
}

// maybe in the future add a sessions table/type or some sort of record to keep track of when cards were answered correctly or incorrectly
// however...
// remember that the purpose of this app is basically to be as if you could have physical flashcards
// and each flashcard is like a mini tablet that keeps track of their own level internally and when it's next due (little light indicator of when they're due)
// ...
// if you wanted more advanced features, you'd have to buy a new set of new cards with the new features
// for now let's keep it simple
