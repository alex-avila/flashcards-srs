import { Skeleton } from "@/app/components/ui/skeleton"

export function DeckViewSkeleton() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-6 w-24" />
      </div>

      <div className="mt-2 text-sm">
        <div className="my-2">
          <Skeleton className="h-px w-full" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="my-2">
          <Skeleton className="h-px w-full" />
        </div>
        <Skeleton className="h-9 w-40" />
      </div>

      <div className="pt-5">
        <div className="border-b">
          <div className="grid grid-cols-5 p-4">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12 justify-self-end" />
            <Skeleton className="h-4 w-24 justify-self-end" />
            <div className="w-14" /> {/* Space for actions */}
          </div>
        </div>
        <div className="space-y-2 p-4">
          {/* Generate 5 skeleton rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid grid-cols-5 items-center">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-8 justify-self-end" />
              <Skeleton className="h-4 w-16 justify-self-end" />
              <div className="flex justify-end">
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          ))}
        </div>
        <div className="border-t p-4">
          <div className="space-y-2">
            <Skeleton className="mx-auto h-4 w-64" />
            <Skeleton className="mx-auto h-4 w-64" />
          </div>
        </div>
      </div>
    </div>
  )
}
