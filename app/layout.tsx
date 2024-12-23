import type { Metadata } from "next"
import { zenKakuGothicNew } from "@/app/fonts"
import { ThemeProvider } from "@/app/components/theme-provider"
import { Toaster } from "./components/ui/toaster"
import "./globals.css"

// TODO: improve metadata
export const metadata: Metadata = {
  title: "Kioku Flashcards",
  description: "Flashcards SRS app",
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
