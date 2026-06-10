import { BookResultSkeleton } from "@/components/search/book-result-skeleton"
import { SearchInputSkeleton } from "@/components/search/search-input-skeleton"

export default function SearchLoading() {
  return (
    <div className="min-h-svh bg-secondary px-4 py-8">
      <div className="mx-auto w-full max-w-2xl">
        <SearchInputSkeleton />
        <div className="h-4" />
        <ul className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <BookResultSkeleton key={index} />
          ))}
        </ul>
      </div>
    </div>
  )
}
