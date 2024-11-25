import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import { ModeToggle } from "@/app/components/ui/mode-toggle"
import Link from "next/link"

export default function Header() {
  return (
    <header className="mx-4 border-b py-4">
      <NavigationMenu.Root>
        <NavigationMenu.List className="flex items-center">
          <NavigationMenu.Item>
            <NavigationMenu.Link asChild>
              <Link href="/" className="font-medium">
                <h1>kioku flashcards</h1>
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item className="ml-auto">
            <ModeToggle />
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </header>
  )
}
