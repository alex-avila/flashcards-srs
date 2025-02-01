import * as React from "react"
import Link from "next/link"
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

export async function AccountDropdown() {
  const session = await auth()

  if (!session?.user)
    return (
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <Link href="/login">Log in</Link>
        </Button>
        <Button asChild>
          <Link href="/signup">Sign up</Link>
        </Button>
      </div>
    )

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
