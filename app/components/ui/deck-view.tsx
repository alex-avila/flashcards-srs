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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { Ellipsis } from "lucide-react"
import NewCardSheet from "@/app/components/ui/new-card-sheet"
import { useState } from "react"
import { FlashcardDialog } from "./flashcard-dialog"

interface DeckViewProps {
  deckId: string
  deckName: string
  cards: Card[]
}
export default function DeckView({ deckId, deckName, cards }: DeckViewProps) {
  const [open, setOpen] = useState(false)
  const [activeCard, setActiveCard] = useState<Card | null>(null)

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
              <TableHead className="min-w-24 text-xs">front</TableHead>
              <TableHead className="text-xs">back</TableHead>
              <TableHead className="text-xs">level</TableHead>
              <TableHead className="whitespace-nowrap text-right text-xs">
                next review
              </TableHead>
              <TableHead className="sr-only text-xs">card actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cards.map(card => (
              <TableRow key={card.id}>
                <TableCell className="max-w-28 overflow-x-hidden text-ellipsis whitespace-nowrap font-medium">
                  {card.front}
                </TableCell>
                <TableCell className="max-w-28 overflow-x-hidden text-ellipsis whitespace-nowrap">
                  {card.back}
                </TableCell>
                <TableCell className="text-right">{card.level}</TableCell>
                <TableCell className="text-right">
                  {card.next_review_date || "n/a"}
                </TableCell>
                <TableCell className="flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost">
                        <Ellipsis aria-label="open card actions menu" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setActiveCard(card)}>
                        view
                      </DropdownMenuItem>
                      <DropdownMenuItem>edit</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <FlashcardDialog
          open={Boolean(activeCard)}
          onOpenChange={open => !open && setActiveCard(null)}
          card={activeCard}
        />
        <NewCardSheet deckId={deckId} open={open} onOpenChange={setOpen} />
      </div>
    </div>
  )
}
