"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Ellipsis } from "lucide-react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog"
import { Separator } from "@/app/components/ui/separator"
import { Button } from "@/app/components/ui/button"
import { FlashcardSheet } from "@/app/components/ui/flashcard-sheet"
import { FlashcardDialog } from "@/app/components/ui/flashcard-dialog"
import { SelectDeck, SelectCard } from "@/app/db/schema"
import { deleteCard } from "@/app/lib/actions"

enum Mode {
  CREATE = "create",
  VIEW = "view",
  EDIT = "edit",
  DELETE = "delete",
  IDLE = "idle",
}

interface DeckViewProps {
  deck: SelectDeck
  cards: SelectCard[]
}

export function DeckView({ deck, cards }: DeckViewProps) {
  const pathname = usePathname()
  const [mode, setMode] = useState<Mode>(Mode.IDLE)
  const [activeCardIndex, setActiveCardIndex] = useState<number | undefined>()
  const activeCard = activeCardIndex ? cards[activeCardIndex] : undefined

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-medium">
          {deck.name}{" "}
          <span className="text-xs font-normal">
            (
            <Link
              href={`/decks/${encodeURIComponent(deck.pathname)}/edit`}
              className="cursor-pointer underline-offset-4 hover:underline"
            >
              edit
            </Link>
            )
          </span>
        </h2>
        <Button variant="link" onClick={() => setMode(Mode.CREATE)}>
          + new card
        </Button>
      </div>

      <div className="mt-2 text-sm">
        <div>{deck.description}</div>
        <div className="mt-2 flex items-center space-x-3">
          <div>
            lessons per day:{" "}
            <span className="font-medium">{deck.lessonsPerDay}</span>
          </div>
          <Separator className="h-4" orientation="vertical" />
          <div>
            lessons batch size:{" "}
            <span className="font-medium">{deck.lessonsBatchSize}</span>
          </div>
        </div>
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
            {cards.map((card, index) => (
              <TableRow key={card.id}>
                <TableCell className="max-w-28 overflow-x-hidden text-ellipsis whitespace-nowrap font-medium">
                  {card.front}
                </TableCell>
                <TableCell className="max-w-28 overflow-x-hidden text-ellipsis whitespace-nowrap">
                  {card.back}
                </TableCell>
                <TableCell className="text-right">{card.level}</TableCell>
                <TableCell className="text-right">
                  {card.nextReviewDate
                    ? new Date(card.nextReviewDate).toString()
                    : "n/a"}
                </TableCell>
                <TableCell className="flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost">
                        <Ellipsis aria-label="open card actions menu" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setMode(Mode.VIEW)
                          setActiveCardIndex(index)
                        }}
                      >
                        view
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setMode(Mode.EDIT)
                          setActiveCardIndex(index)
                        }}
                      >
                        edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setMode(Mode.DELETE)
                          setActiveCardIndex(index)
                        }}
                      >
                        delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <FlashcardDialog
          card={activeCard}
          open={mode === Mode.VIEW}
          onOpenChange={open => {
            if (!open) {
              setMode(Mode.IDLE)
            }
          }}
        />
        <FlashcardSheet
          deckId={deck.id}
          open={mode === Mode.CREATE}
          onOpenChange={open => {
            if (!open) {
              setMode(Mode.IDLE)
            }
          }}
          title="create a new card"
          description="enter new card details and submit to add to the deck"
          submitLabel="create"
          submitPendingLabel="creating…"
        />
        {/* TODO: make sure edit sheet is closed after successfully editing */}
        <FlashcardSheet
          deckId={deck.id}
          card={activeCard}
          open={mode === Mode.EDIT}
          onOpenChange={open => {
            if (!open) {
              setMode(Mode.IDLE)
            }
          }}
          title="edit"
          description="edit card details and submit to update"
          submitLabel="update"
          submitPendingLabel="updating…"
        />
        <Dialog
          open={mode === Mode.DELETE}
          onOpenChange={open => {
            if (!open) {
              setMode(Mode.IDLE)
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>delete card</DialogTitle>
              <DialogDescription>
                are you sure you want to delete this card?
                {
                  <>
                    <span>{": "}</span>
                    <span className="font-medium">{activeCard?.front}</span>
                  </>
                }
              </DialogDescription>
              <div className="mx-auto flex gap-2 pt-2">
                <Button onClick={() => setMode(Mode.IDLE)}>cancel</Button>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    if (activeCard?.id) {
                      await deleteCard(activeCard.id, pathname)
                      setMode(Mode.IDLE)
                    }
                  }}
                >
                  delete
                </Button>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
