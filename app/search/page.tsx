"use client"

import { BookResult } from "@/components/search/book-result"
import { BookResultSkeleton } from "@/components/search/book-result-skeleton"
import { SearchEmpty } from "@/components/search/search-empty"
import { SearchInput } from "@/components/search/search-input"
import { SearchBooksResult } from "@/lib/gcloud/types"
import { useDebounce } from "@uidotdev/usehooks"
import { useQuery } from "@tanstack/react-query"
import { parseAsString, useQueryState } from "nuqs"

async function fetchBooks(query: string): Promise<SearchBooksResult> {
  const response = await fetch(`/api/books?q=${encodeURIComponent(query)}`)

  if (!response.ok) {
    throw new Error("Failed to fetch books")
  }

  return response.json()
}

export default function SearchPage() {
  const [query, setQuery] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({ shallow: false })
  )

  const debouncedQuery = useDebounce(query, 500)

  const { data, isLoading, error } = useQuery({
    queryKey: ["books", debouncedQuery],
    queryFn: () => fetchBooks(debouncedQuery!),
    enabled: !!debouncedQuery,
  })

  const isSearching = isLoading || (!!query && query !== debouncedQuery)

  return (
    <div className="min-h-svh bg-secondary px-4 py-8">
      <div className="mx-auto w-full max-w-2xl">
        <form onSubmit={(e) => e.preventDefault()}>
          <SearchInput value={query} onChange={setQuery} />
        </form>
        <div className="h-4" />
        {isSearching && (
          <ul className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <BookResultSkeleton key={index} />
            ))}
          </ul>
        )}
        {!isSearching && error && <p>Failed to load books. {error.message}</p>}
        {!isSearching && !error && !debouncedQuery && (
          <SearchEmpty message="Search for a book to get started" />
        )}
        {!isSearching &&
          !error &&
          debouncedQuery &&
          data?.items.length === 0 && <SearchEmpty message="No books found" />}
        {!isSearching && data && data.items.length > 0 && (
          <ul className="space-y-4">
            {data.items.map((book) => (
              <BookResult key={book.id} book={book} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
