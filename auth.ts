import NextAuth, { DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import { authConfig } from "./auth.config"
import { SelectUser } from "./app/db/schema"
import { db } from "./app/db"
import { userSchema } from "./app/db/schema"

declare module "next-auth" {
  interface Session {
    user: {
      id: number
      username: string
    } & DefaultSession["user"]
  }
}

async function getUser(username: string): Promise<SelectUser | undefined> {
  try {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.username, username),
    })
    return user
  } catch (error) {
    console.error("Failed to fetch user:", error)
    throw new Error("Failed to fetch user.")
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials) {
        const parsedCredentials = userSchema.safeParse(credentials)

        if (parsedCredentials.success) {
          const { username, password } = parsedCredentials.data
          const user = await getUser(username)
          if (!user) return null
          const passwordsMatch = await (user.password
            ? bcrypt.compare(password, user.password!)
            : Promise.resolve(false))

          if (passwordsMatch) {
            return {
              ...user,
              // return id as a string since that's what the authorize function expects as the type of user.id
              id: String(user.id),
            }
          }
        }

        console.log("Invalid credentials")
        return null
      },
    }),
  ],
})
