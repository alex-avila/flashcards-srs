import type { Metadata } from "next"
import { zenKakuGothicNew } from "@/app/fonts"
import { ThemeProvider } from "@/app/components/theme-provider"
import { Toaster } from "./components/ui/toaster"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    template: "%s | Lernprozess Flashcards",
    default: "Lernprozess Flashcards",
  },
  description:
    "Lernprozess Flashcards can be utilized to create custom flashcards and implements a spaced repetition system to allow users to review and retain content before it's forgotten.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={zenKakuGothicNew.variable}
      suppressHydrationWarning
    >
      <body>
        <div className="mx-auto max-w-screen-lg">
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </div>
      </body>
    </html>
  )
}
