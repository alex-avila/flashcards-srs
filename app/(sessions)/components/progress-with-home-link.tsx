import Link from "next/link"
import { House } from "lucide-react"
import { Progress } from "@/app/components/ui/progress"
import { Button } from "@/app/components/ui/button"

export function ProgressWithHomeLink({ progress }: { progress: number }) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" asChild>
        <Link href="/">
          <House aria-label="go back to dashboard" />
        </Link>
      </Button>
      <Progress value={progress} />
    </div>
  )
}
