import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/app/components/ui/button"

export default function LoginPage({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {children}
      <div className="mt-4 flex justify-center">
        <Button variant="link" asChild>
          <Link href="/">
            <span>Learn more on the landing page</span>
            <ArrowRight />
          </Link>
        </Button>
      </div>
    </>
  )
}
