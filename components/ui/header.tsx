import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import Link from "next/link"

export default function Header() {
  return (
    <header className="border-b border-zinc-700 p-3">
      <NavigationMenu.Root>
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Link asChild>
              <Link href="/" className="font-medium">
                <h1>kioku flashcards</h1>
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </header>
  )
}
