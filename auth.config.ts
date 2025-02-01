import type { NextAuthConfig } from "next-auth"
import { UNRESTRICTED_PATHS } from "@/app/lib/utils/constants"

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnRestricted = !UNRESTRICTED_PATHS.some(path =>
        nextUrl.pathname.startsWith(path)
      )
      if (isOnRestricted) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl))
      }

      return true
    },

    async jwt({ token, user }) {
      if (user)
        token.user = Object.fromEntries(
          Object.entries(user).filter(([key]) => key !== "password")
        )
      return token
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.user = {
        ...session.user,
        ...(token.user ? token.user : {}),
      }
      return session
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig
