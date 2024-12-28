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
import {
  FlashcardFormProvider,
  FlashcardForm,
  FlashcardFormFooter,
} from "@/app/components/ui/flashcard-form"
import { SelectCard } from "@/app/db/schema"

interface FlashcardSheetProps {
  deckId: number
  mode: "create" | "edit"
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
  mode,
  card,
  title,
  description,
  submitLabel,
  submitPendingLabel,
  onOpenChange,
  open,
}: FlashcardSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetPortal>
        <SheetContent
          side="bottom"
          className="mx-auto max-w-md rounded-t-md shadow"
        >
          <FlashcardFormProvider mode={mode} deckId={deckId} card={card}>
            <SheetHeader className="text-left">
              <SheetTitle>{title}</SheetTitle>
              <SheetDescription className="sr-only">
                {description}
              </SheetDescription>
            </SheetHeader>
            <div className="py-2 pb-4 text-left">
              <FlashcardForm
                onSubmitSuccess={() => {
                  onOpenChange?.(false)
                }}
              />
            </div>
            <SheetFooter>
              <FlashcardFormFooter {...{ submitLabel, submitPendingLabel }} />
            </SheetFooter>
          </FlashcardFormProvider>
        </SheetContent>
      </SheetPortal>
    </Sheet>
  )
}
