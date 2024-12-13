"use client"

import Link from "next/link"
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
import { Separator } from "@/app/components/ui/separator"
import { Button } from "@/app/components/ui/button"
import { FlashcardSheet } from "@/app/components/ui/flashcard-sheet"
import { FlashcardDialog } from "@/app/components/ui/flashcard-dialog"
import { useCardActions } from "@/app/hooks/use-card-actions"
import { SelectDeck, SelectCard } from "@/app/db/schema"

interface DeckViewProps {
  deck: SelectDeck
  cards: SelectCard[]
}

export function DeckView({ deck, cards }: DeckViewProps) {
  const [cardActionsState, cardActionsDispatch] = useCardActions({
    mode: "idle",
  })

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-medium">
          {deck.name}{" "}
          <span className="text-xs font-normal">
            (
            <Link
              href={`/decks/${deck.pathname}/edit`}
              className="cursor-pointer underline-offset-4 hover:underline"
            >
              edit
            </Link>
            )
          </span>
        </h2>
        <Button
          variant="link"
          onClick={() => cardActionsDispatch({ type: "START_CREATE" })}
        >
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
                        onClick={() =>
                          cardActionsDispatch({ card, type: "VIEW" })
                        }
                      >
                        view
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          cardActionsDispatch({ card, type: "START_EDIT" })
                        }
                      >
                        edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          cardActionsDispatch({ card, type: "DELETE" })
                        }
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
          card={cardActionsState.card}
          open={cardActionsState.mode === "view"}
          onOpenChange={open => !open && cardActionsDispatch({ type: "RESET" })}
        />
        <FlashcardSheet
          deckId={deck.id}
          open={cardActionsState.mode === "create"}
          onOpenChange={open => !open && cardActionsDispatch({ type: "RESET" })}
          title="create a new card"
          description="enter new card details and submit to add to the deck"
          submitLabel="create"
          submitPendingLabel="creating…"
        />
        {/* TODO: make sure edit sheet is closed after successfully editing */}
        <FlashcardSheet
          deckId={deck.id}
          card={cardActionsState.card}
          open={cardActionsState.mode === "edit"}
          onOpenChange={open => !open && cardActionsDispatch({ type: "RESET" })}
          title="edit"
          description="edit card details and submit to update"
          submitLabel="update"
          submitPendingLabel="updating…"
        />
      </div>
    </div>
  )
}
