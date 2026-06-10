import { BookResultSkeleton } from "@/components/search/book-result-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function WishlistLoading() {
  return (
    <div className="min-h-svh bg-secondary px-4 py-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-2xl" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="h-6" />
        <ul className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <BookResultSkeleton key={index} />
          ))}
        </ul>
      </div>
    </div>
  )
}
