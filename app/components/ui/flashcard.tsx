import { Sparkle, EllipsisVertical } from "lucide-react"
import clsx from "clsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { Button } from "@/app/components/ui/button"
import { Card as CardSchema } from "@/app/db/schema"
import { useState } from "react"

export interface FlashcardProps {
  card: CardSchema
}

export function Flashcard({ card }: FlashcardProps) {
  const [view, setView] = useState<"front" | "back">("front")
  const flip = () => {
    setView(view === "front" ? "back" : "front")
  }

  return (
    <div
      className={clsx("rounded-xl p-3", {
        "bg-secondary": view === "front",
        "bg-primary": view === "back",
      })}
    >
      <div className="rounded-lg border border-primary bg-secondary p-2 dark:border-muted-foreground">
        <div className="flex justify-between pb-2">
          <div className="flex gap-1.5" aria-hidden>
            {[...new Array(card.level || 1).keys()].map((_, i) => (
              <div
                key={i}
                className="flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground"
              >
                <Sparkle className="size-3 fill-primary-foreground" />
              </div>
            ))}
          </div>
          <div className="sr-only">level: {card.level}</div>
          <DropdownMenu>
            <DropdownMenuTrigger className="h-4 p-0 text-xs">
              <EllipsisVertical
                className="size-4"
                aria-label="open card actions dropdown menu"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>edit</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-col">
          <div className="flex w-48 justify-center self-center rounded px-4 py-6">
            <div className="text-center text-xl">
              {view === "back" ? card.back : card.front}
            </div>
          </div>
          <div className="mt-auto flex items-end justify-between">
            <div className="text-sm text-muted-foreground">
              {view === "back" ? "back" : "front"}
            </div>
            <Button onClick={flip} variant="outline">
              flip
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
