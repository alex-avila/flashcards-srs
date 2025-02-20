import type { Metadata } from "next"
import Link from "next/link"
import { Decks } from "../components/decks"
import { Button } from "@/app/components/ui/button"
import { Suspense } from "react"
import { DecksSkeleton } from "../components/decks-skeleton"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  return (
    <section className="grid grid-cols-1 gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">All decks</h2>
        <Button asChild variant="link">
          <Link href="/decks/new">+ New deck</Link>
        </Button>
      </div>

      <Suspense fallback={<DecksSkeleton />}>
        <Decks />
      </Suspense>
    </section>
  )
}
