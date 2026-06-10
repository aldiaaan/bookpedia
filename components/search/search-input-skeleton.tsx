import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export type SearchInputSkeletonProps = {
  className?: string
}

export function SearchInputSkeleton({ className }: SearchInputSkeletonProps) {
  return (
    <Skeleton
      className={cn("h-13 w-full rounded-full bg-background", className)}
    />
  )
}
