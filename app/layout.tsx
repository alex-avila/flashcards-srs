import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { zenKakuGothicNew } from "@/app/fonts"
import Header from "@/components/ui/header"
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
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="p-4">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
