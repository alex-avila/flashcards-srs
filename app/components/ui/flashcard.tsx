import { useState } from "react"
import { clsx } from "clsx"
import { Sparkle } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { SelectCard } from "@/app/db/schema"

const SHOWN_STARS_LIMIT = 5

export interface FlashcardProps {
  card: SelectCard
  canFlip?: boolean
  flipped?: boolean
  onFlipped?: (flipped: boolean) => void
}

export function Flashcard({
  card,
  canFlip = true,
  flipped: flippedControlled,
  onFlipped,
}: FlashcardProps) {
  const [flippedLocal, setFlippedLocal] = useState(false)

  const flipped = flippedControlled ?? flippedLocal

  const flip = () => {
    if (onFlipped) {
      onFlipped(!flipped)
    } else {
      setFlippedLocal(!flipped)
    }
  }

  return (
    <div
      className={clsx("mx-auto w-full max-w-sm rounded-xl p-3 shadow-md", {
        "bg-secondary": !flipped,
        "bg-primary": flipped,
      })}
    >
      <div className="aspect-[4/2] rounded-lg border border-primary bg-secondary p-2 dark:border-muted-foreground">
        <div className="mb-2 flex h-4 justify-between">
          <div className="flex items-center gap-1.5" aria-hidden>
            {[...new Array(Math.min(card.level, SHOWN_STARS_LIMIT)).keys()].map(
              (_, i) => (
                <div
                  key={i}
                  className="flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground"
                >
                  <Sparkle className="size-3 fill-primary-foreground" />
                </div>
              )
            )}
            {card.level > SHOWN_STARS_LIMIT && (
              <div>+{card.level - SHOWN_STARS_LIMIT}</div>
            )}
            <div className="sr-only">level: {card.level}</div>
          </div>
        </div>

        <div className="flex h-full flex-col">
          <div className="m-auto flex w-48 justify-center self-center rounded px-4 py-6">
            {/* TODO: add 'lang' property to div properly */}
            {/* <div className="text-center text-xl" lang={flipped ? "en" : "ja"}> */}
            <div className="text-center text-xl">
              {flipped ? card.back : card.front}
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-sm text-muted-foreground">
              {flipped ? "back" : "front"}
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
