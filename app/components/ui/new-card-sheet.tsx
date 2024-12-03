"use client"

import {
  Sheet,
  SheetPortal,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet"
import { DialogProps } from "@radix-ui/react-dialog"

export default function NewCardSheet({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: DialogProps["onOpenChange"]
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger>Open</SheetTrigger>
      <SheetPortal>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </SheetPortal>
    </Sheet>
  )
}
