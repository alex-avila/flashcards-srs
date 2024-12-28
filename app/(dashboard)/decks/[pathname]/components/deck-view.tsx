"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemo, useState } from "react"
import { Ellipsis, Eye, EyeOff } from "lucide-react"
import { clsx } from "clsx"

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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog"
import { Button } from "@/app/components/ui/button"
import { FlashcardSheet } from "@/app/components/ui/flashcard-sheet"
import { FlashcardDialog } from "@/app/components/ui/flashcard-dialog"
import { useDayjs } from "@/app/hooks/use-dayjs"
import { SelectDeck, SelectCard } from "@/app/db/schema"
import { deleteCard } from "@/app/lib/actions"
import { getMaxSrsLevel } from "@/app/lib/utils/srs"
import { Separator } from "@radix-ui/react-separator"
import { Flashcard } from "@/app/components/ui/flashcard"

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
  const [backHidden, setBackHidden] = useState(true)
  const [activeCardIndex, setActiveCardIndex] = useState<number | undefined>()
  const activeCard =
    activeCardIndex !== undefined ? cards[activeCardIndex] : undefined
  const dayjs = useDayjs()

  const maxSrsLevel = getMaxSrsLevel(deck.srsTimingsType)

  // sort cards by date, show ones that are due now or soon at the top
  const cardsSorted = useMemo(
    () =>
      cards.sort((a, b) => {
        const aDate = a.nextReviewDate ? new Date(a.nextReviewDate) : Infinity
        const bDate = b.nextReviewDate ? new Date(b.nextReviewDate) : Infinity

        return aDate === bDate ? 0 : aDate > bDate ? 1 : -1
      }),
    [cards]
  )

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-medium">
          {deck.name}{" "}
          <span className="text-xs font-normal">
            (
            <Link
              href={`/decks/${encodeURIComponent(deck.pathname)}/settings`}
              className="cursor-pointer underline-offset-4 hover:underline"
            >
              settings
            </Link>
            )
          </span>
        </h2>
        <Button variant="link" onClick={() => setMode(Mode.CREATE)}>
          + New card
        </Button>
      </div>

      <div className="mt-2 text-sm">
        <div>{deck.description}</div>
        <Separator className="my-2 h-px w-full bg-muted" />
        <div>
          Lessons per day:{" "}
          <span className="font-medium">{deck.lessonsPerDay}</span>
        </div>
        <div>
          Lessons batch size:{" "}
          <span className="font-medium">{deck.lessonsBatchSize}</span>
        </div>
        <div>
          Max level: <span className="font-medium">{maxSrsLevel}</span>
        </div>
        <Separator className="my-2 h-px w-full bg-muted" />
        <Button onClick={() => setBackHidden(!backHidden)} variant="outline">
          <div className="flex items-center gap-2">
            <span>{backHidden ? "Show" : "Hide"} back of cards</span>
            {backHidden ? (
              <Eye className="relative top-0.5 !size-3.5" />
            ) : (
              <EyeOff className="relative top-0.5 !size-3.5" />
            )}
          </div>
        </Button>
      </div>

      <div className="pt-5">
        {/* TODO: use the data table example instead for more advanced features */}
        <Table>
          <TableCaption>
            <div>A list of the flashcards and associated stats.</div>
            <div className="pt-3 text-center text-sm text-muted-foreground">
              Last updated on: {dayjs().format("MMMM DD, YYYY [at] h:mma")}
            </div>
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Front</TableHead>
              <TableHead className="text-xs">Back</TableHead>
              <TableHead className="text-right text-xs">Level</TableHead>
              <TableHead className="whitespace-nowrap text-right text-xs">
                Next review in
              </TableHead>
              <TableHead className="sr-only text-xs">
                Flashcard actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cardsSorted.map((card, index) => (
              <TableRow key={card.id}>
                <TableCell className="max-w-28 overflow-x-hidden text-ellipsis whitespace-nowrap font-medium">
                  {card.front}
                </TableCell>
                <TableCell className="max-w-28 overflow-x-hidden text-ellipsis whitespace-nowrap">
                  <div
                    className={clsx("inline", {
                      "select-none bg-muted text-muted": backHidden,
                    })}
                  >
                    {backHidden && <span className="sr-only">hidden</span>}
                    <span aria-hidden={backHidden}>{card.back}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {card.level}
                  {maxSrsLevel === card.level ? "*" : ""}
                </TableCell>
                <TableCell className="text-right">
                  {!card.nextReviewDate
                    ? "n/a"
                    : dayjs(card.nextReviewDate).isBefore(dayjs())
                      ? "now"
                      : dayjs().to(card.nextReviewDate, true)}
                </TableCell>
                <TableCell className="flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost">
                        <Ellipsis aria-label="open flashcard actions menu" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setMode(Mode.VIEW)
                          setActiveCardIndex(index)
                        }}
                      >
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setMode(Mode.EDIT)
                          setActiveCardIndex(index)
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setMode(Mode.DELETE)
                          setActiveCardIndex(index)
                        }}
                      >
                        Delete
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
          mode={Mode.CREATE}
          onOpenChange={open => {
            if (!open) {
              setMode(Mode.IDLE)
            }
          }}
          title="Add a flashcard"
          description="Enter new flashcard details and submit to add to the deck"
          submitLabel="Add flashcard"
          submitPendingLabel="Adding…"
        />
        <FlashcardSheet
          deckId={deck.id}
          mode={Mode.EDIT}
          card={activeCard}
          open={mode === Mode.EDIT}
          onOpenChange={open => {
            if (!open) {
              setMode(Mode.IDLE)
            }
          }}
          title="Edit flashcard"
          description="Edit flashcard details and submit to update"
          submitLabel="Edit flashcard"
          submitPendingLabel="Updating…"
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
              <DialogTitle>Delete card</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this card?
              </DialogDescription>
            </DialogHeader>
            {activeCard && <Flashcard card={activeCard} />}
            <DialogFooter>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button onClick={() => setMode(Mode.IDLE)}>Cancel</Button>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    if (activeCard?.id) {
                      await deleteCard(activeCard.id, pathname)
                      setMode(Mode.IDLE)
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
