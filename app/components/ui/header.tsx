import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import { ModeToggle } from "@/app/components/ui/mode-toggle"
import Link from "next/link"
import { AccountMenu } from "./account-menu"
import { auth } from "@/auth"

export default async function Header() {
  const session = await auth()

  return (
    <header className="mx-4 border-b py-4">
      <NavigationMenu.Root>
        <NavigationMenu.List className="flex items-center">
          <NavigationMenu.Item>
            <NavigationMenu.Link asChild>
              <Link
                href={session?.user ? "/dashboard" : "/"}
                className="font-medium"
              >
                <h1>Lernprozess Flashcards</h1>
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item className="ml-auto mr-2">
            <AccountMenu />
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <ModeToggle />
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </header>
  )
}
