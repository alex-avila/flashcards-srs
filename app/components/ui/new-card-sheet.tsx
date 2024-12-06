"use client"

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
import NewCardForm from "@/app/components/ui/new-card-form"
import { Button } from "@/app/components/ui/button"
import { useState } from "react"

const FORM_ID = "new-card-form"

interface NewCardSheetProps {
  deckId: string
  open: boolean
  onOpenChange: DialogProps["onOpenChange"]
}

export default function NewCardSheet({
  deckId,
  open,
  onOpenChange,
}: NewCardSheetProps) {
  const [isPending, setIsPending] = useState(false)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetPortal>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>create a new card</SheetTitle>
            <SheetDescription className="sr-only">
              create a new card to add to the current deck
            </SheetDescription>
          </SheetHeader>
          <div className="pb-4 text-left">
            <NewCardForm
              formId={FORM_ID}
              deckId={deckId}
              onIsPendingUpdate={setIsPending}
              withSubmitButton={false}
            />
          </div>
          <SheetFooter>
            <Button form={FORM_ID} type="submit" disabled={isPending}>
              {!isPending ? "create" : "creating..."}
            </Button>
          </SheetFooter>
        </SheetContent>
      </SheetPortal>
    </Sheet>
  )
}
