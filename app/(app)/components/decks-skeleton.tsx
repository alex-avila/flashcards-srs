import { Skeleton } from "@/app/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/app/components/ui/card"

export async function DecksSkeleton() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(theme(columns.3xs),1fr))] gap-4">
      {[1, 2, 3, 4].map(num => (
        <Card key={num}>
          <CardHeader>
            {/* Title skeleton */}
            <Skeleton className="h-5 w-[200px]" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="space-y-2 pb-3">
                {/* Lessons count skeleton */}
                <Skeleton className="h-4 w-24" />
                {/* Lessons button skeleton */}
                <Skeleton className="h-9 w-28" />
              </div>
              <div className="space-y-2 border-t pt-3">
                {/* Reviews count skeleton */}
                <Skeleton className="h-4 w-24" />
                {/* Reviews button skeleton */}
                <Skeleton className="h-9 w-28" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
