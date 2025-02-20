import Link from "next/link"
import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import { ModeToggle } from "@/app/components/ui/mode-toggle"
import { Button } from "@/app/components/ui/button"
import { AccountMenu } from "./account-menu"

interface HeaderProps {
  isLanding?: boolean
}

export function Header({ isLanding = false }: HeaderProps) {
  return (
    <header className="mx-4 border-b py-4">
      <NavigationMenu.Root>
        <NavigationMenu.List className="flex items-center">
          <NavigationMenu.Item>
            <NavigationMenu.Link asChild>
              <Link
                href={isLanding ? "/" : "/dashboard"}
                className="font-medium"
              >
                <h1>Lernprozess Flashcards</h1>
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item className="ml-auto mr-2">
            {isLanding ? (
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign up</Link>
                </Button>
              </div>
            ) : (
              <AccountMenu />
            )}
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <ModeToggle />
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </header>
  )
}
