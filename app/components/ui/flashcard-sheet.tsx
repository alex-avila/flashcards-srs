import { useState } from "react"
import { DialogProps } from "@radix-ui/react-dialog"
import {
  Sheet,
  SheetDescription,
  SheetPortal,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/app/components/ui/sheet"
import { FlashcardForm } from "@/app/components/ui/flashcard-form"
import { Button } from "@/app/components/ui/button"
import { SelectCard } from "@/app/db/schema"

const FORM_ID = "card-sheet-form"

interface FlashcardSheetProps {
  deckId: number
  card?: SelectCard
  title: string
  description: string
  submitLabel: string
  submitPendingLabel: string
  onOpenChange: DialogProps["onOpenChange"]
  open: DialogProps["open"]
}

export function FlashcardSheet({
  deckId,
  card,
  title,
  description,
  submitLabel,
  submitPendingLabel,
  onOpenChange,
  open,
}: FlashcardSheetProps) {
  const [isPending, setIsPending] = useState(false)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetPortal>
        <SheetContent
          side="bottom"
          className="mx-auto max-w-md rounded-t-md shadow"
        >
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription className="sr-only">
              {description}
            </SheetDescription>
          </SheetHeader>
          <div className="pb-4 text-left">
            <FlashcardForm
              formId={FORM_ID}
              deckId={deckId}
              card={card}
              onIsPendingUpdate={setIsPending}
              withSubmitButton={false}
            />
          </div>
          <SheetFooter>
            <Button form={FORM_ID} type="submit" disabled={isPending}>
              {!isPending ? submitLabel : submitPendingLabel}
            </Button>
          </SheetFooter>
        </SheetContent>
      </SheetPortal>
    </Sheet>
  )
}
