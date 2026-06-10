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

  const { data, isLoading, error } = useQuery({
    queryKey: ["wishlist"],
    queryFn: fetchWishlistBooks,
  })

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
        {isLoading && (
          <ul className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <BookResultSkeleton key={index} />
            ))}
          </ul>
        )}
        {!isLoading && error && <p>Failed to load wishlist. {error.message}</p>}
        {!isLoading && !error && data?.items.length === 0 && (
          <SearchEmpty message="Your wishlist is empty" />
        )}
        {!isLoading && data && data.items.length > 0 && (
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
