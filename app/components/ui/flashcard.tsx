import { useEffect, useState } from "react"
import { clsx } from "clsx"
import { Sparkle } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Card as CardSchema } from "@/app/db/schema"

export interface FlashcardProps {
  card: CardSchema
  canFlip: boolean
  flipped: boolean
}

export function Flashcard({
  card,
  canFlip = true,
  flipped = false,
}: FlashcardProps) {
  const [view, setView] = useState<"front" | "back">("front")
  const flip = () => {
    setView(view === "front" ? "back" : "front")
  }

  // TODO: consider if this is the best way of controlling the flipped status of the card from the outside
  useEffect(() => {
    setView(flipped ? "back" : "front")
  }, [flipped])

  return (
    <div
      className={clsx("rounded-xl p-3 shadow-md", {
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
        </div>

        <div className="flex flex-col">
          <div className="flex w-48 justify-center self-center rounded px-4 py-6">
            {/* TODO: add 'lang' property to div properly */}
            <div
              className="text-center text-xl"
              lang={view === "back" ? "en" : "ja"}
            >
              {view === "back" ? card.back : card.front}
            </div>
          </div>
          <div className="mt-auto flex items-end justify-between">
            <div className="text-sm text-muted-foreground">
              {view === "back" ? "back" : "front"}
            </div>
            {canFlip && (
              <Button onClick={flip} variant="outline">
                flip
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
