import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import { ModeToggle } from "@/app/components/ui/mode-toggle"
import Link from "next/link"
import { AccountDropdown } from "./account-dropdown"

export default function Header() {
  return (
    <header className="mx-4 border-b py-4">
      <NavigationMenu.Root>
        <NavigationMenu.List className="flex items-center">
          <NavigationMenu.Item>
            <NavigationMenu.Link asChild>
              <Link href="/dashboard" className="font-medium">
                <h1>Lernprozess Flashcards</h1>
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item className="ml-auto mr-2">
            <AccountDropdown />
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <ModeToggle />
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </header>
  )
}
