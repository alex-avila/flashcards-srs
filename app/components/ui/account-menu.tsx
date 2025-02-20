import * as React from "react"
import { SquareUser } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { Button } from "@/app/components/ui/button"
import { signOut, auth } from "@/auth"

export async function AccountMenu() {
  const session = await auth()

  if (!session?.user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <SquareUser className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 text-foreground transition-all" />
          <span className="sr-only">View account links</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{session.user.username}</DropdownMenuLabel>
        <form
          action={async () => {
            "use server"
            await signOut()
          }}
        >
          <DropdownMenuItem className="w-full" asChild>
            <button type="submit">Log out</button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
