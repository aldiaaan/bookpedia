import { Skeleton } from "@/components/ui/skeleton"

export function BookResultSkeleton() {
  return (
    <li className="flex gap-4 rounded-lg bg-background p-4">
      <Skeleton className="aspect-2/3 h-48 shrink-0 rounded" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-16" />
      </div>
    </li>
  )
}
