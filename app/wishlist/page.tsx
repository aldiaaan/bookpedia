"use client"

import { Button } from "@/components/ui/button"
import { BookResult } from "@/components/search/book-result"
import { BookResultSkeleton } from "@/components/search/book-result-skeleton"
import { SearchEmpty } from "@/components/search/search-empty"
import { SearchBooksResult } from "@/lib/gcloud/types"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

async function fetchWishlistBooks(): Promise<SearchBooksResult> {
  const response = await fetch("/api/wishlist/books")

  if (!response.ok) {
    throw new Error("Failed to fetch wishlist")
  }

  return response.json()
}

export default function WishlistPage() {
  const router = useRouter()

  const { data, error, isFetching } = useQuery({
    queryKey: ["wishlist"],
    queryFn: fetchWishlistBooks,
  })

  const isInitialLoading = !data && !error
  const isRefetching = isFetching && !!data

  return (
    <div className="min-h-svh bg-secondary px-4 py-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Go back"
            onClick={() => router.back()}
          >
            <ArrowLeft className="size-6" />
          </Button>
          <h1 className="font-serif text-4xl font-bold tracking-tight">
            Wishlist
          </h1>
        </div>
        <div className="h-6" />
        {isInitialLoading && (
          <ul className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <BookResultSkeleton key={index} />
            ))}
          </ul>
        )}
        {!isInitialLoading && error && (
          <p>Failed to load wishlist. {error.message}</p>
        )}
        {!isInitialLoading && !error && data?.items.length === 0 && !isRefetching && (
          <SearchEmpty message="Your wishlist is empty" />
        )}
        {!isInitialLoading && !error && isRefetching && data?.items.length === 0 && (
          <ul className="space-y-4">
            <BookResultSkeleton />
          </ul>
        )}
        {data && data.items.length > 0 && (
          <ul className="space-y-4">
            {data.items.map((book) => (
              <BookResult key={book.id} book={book} />
            ))}
            {isRefetching && <BookResultSkeleton />}
          </ul>
        )}
      </div>
    </div>
  )
}
