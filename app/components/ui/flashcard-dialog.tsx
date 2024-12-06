import {
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/app/components/ui/dialog"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { DialogProps } from "@radix-ui/react-dialog"
import { Flashcard, FlashcardProps } from "@/app/components/ui/flashcard"

type FlashcardDialogProps = Required<
  Pick<DialogProps, "open" | "onOpenChange">
> & { card?: FlashcardProps["card"] }

export function FlashcardDialog({
  open,
  onOpenChange,
  card,
}: FlashcardDialogProps) {
  // TODO: improve the logic that checks for the card to know whether to render the flashcard
  if (open && !card) {
    throw new Error("card not provided")
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogOverlay />
        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 bg-none p-6 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
          {card && (
            <>
              <DialogHeader className="sr-only">
                <DialogTitle>card view</DialogTitle>
                <DialogDescription>viewing {card.front}</DialogDescription>
              </DialogHeader>
              <Flashcard card={card} />
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
