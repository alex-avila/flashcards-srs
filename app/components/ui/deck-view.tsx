"use client"

import { Card } from "@/app/db/schema"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table"
import { Button } from "@/app/components/ui/button"
import NewCardSheet from "@/app/components/ui/new-card-sheet"
import { useState } from "react"

interface DeckViewProps {
  deckId: string
  deckName: string
  cards: Card[]
}
export default function DeckView({ deckId, deckName, cards }: DeckViewProps) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-medium">{deckName}</h2>
        <Button variant="link" onClick={() => setOpen(true)}>
          + new card
        </Button>
      </div>
      <div className="pt-5">
        {/* TODO: use the data table example instead for more advanced features */}
        <Table>
          <TableCaption className="sr-only">
            a list of the cards and associated stats
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>front</TableHead>
              <TableHead>back</TableHead>
              <TableHead>level</TableHead>
              <TableHead className="text-right">next review</TableHead>
              <TableHead>details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cards.map(card => (
              <TableRow key={card.id}>
                <TableCell className="font-medium">{card.front}</TableCell>
                <TableCell>{card.back}</TableCell>
                <TableCell>{card.level}</TableCell>
                <TableCell className="text-right">
                  {card.next_review_date || "n/a"}
                </TableCell>
                <TableCell>
                  <Button variant="link">view</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <NewCardSheet deckId={deckId} open={open} onOpenChange={setOpen} />
      </div>
    </div>
  )
}
