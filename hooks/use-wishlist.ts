"use client"

import { SearchBooksResult } from "@/lib/gcloud/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"

async function addToWishlist(bookId: string) {
  const response = await fetch("/api/wishlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookId }),
  })

  if (!response.ok) {
    throw new Error("Failed to add to wishlist")
  }
}

async function removeFromWishlist(bookId: string) {
  const response = await fetch("/api/wishlist", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookId }),
  })

  if (!response.ok) {
    throw new Error("Failed to remove from wishlist")
  }
}

type ToggleWishlistInput = {
  bookId: string
  isWishlisted: boolean
}

export function useWishlist() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ bookId, isWishlisted }: ToggleWishlistInput) => {
      if (isWishlisted) {
        return removeFromWishlist(bookId)
      }

      return addToWishlist(bookId)
    },
    onMutate: async ({ bookId, isWishlisted }) => {
      await queryClient.cancelQueries({ queryKey: ["books"] })
      await queryClient.cancelQueries({ queryKey: ["wishlist"] })

      const previousBooks = queryClient.getQueriesData<SearchBooksResult>({
        queryKey: ["books"],
      })

      const previousWishlist = queryClient.getQueryData<SearchBooksResult>([
        "wishlist",
      ])

      queryClient.setQueriesData<SearchBooksResult>(
        { queryKey: ["books"] },
        (current) => {
          if (!current) {
            return current
          }

          return {
            items: current.items.map((item) =>
              item.id === bookId
                ? { ...item, isWishlisted: !isWishlisted }
                : item
            ),
          }
        }
      )

      queryClient.setQueryData<SearchBooksResult>(["wishlist"], (current) => {
        if (isWishlisted) {
          if (!current) {
            return current
          }

          return {
            items: current.items.filter((item) => item.id !== bookId),
          }
        }

        const booksQueries = queryClient.getQueriesData<SearchBooksResult>({
          queryKey: ["books"],
        })

        let book: SearchBooksResult["items"][number] | undefined

        for (const [, booksData] of booksQueries) {
          book = booksData?.items.find((item) => item.id === bookId)
          if (book) {
            break
          }
        }

        if (!book) {
          return current
        }

        const wishlistedBook = { ...book, isWishlisted: true }

        if (!current) {
          return { items: [wishlistedBook] }
        }

        if (current.items.some((item) => item.id === bookId)) {
          return current
        }

        return { items: [...current.items, wishlistedBook] }
      })

      return { previousBooks, previousWishlist }
    },
    onError: (_error, _variables, context) => {
      context?.previousBooks.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })

      if (context?.previousWishlist) {
        queryClient.setQueryData(["wishlist"], context.previousWishlist)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] })
      queryClient.invalidateQueries({ queryKey: ["wishlist"] })
    },
  })

  const toggleWishlist = (bookId: string, isWishlisted: boolean) => {
    mutation.mutate({ bookId, isWishlisted })
  }

  const isToggling = (bookId: string) =>
    mutation.isPending && mutation.variables?.bookId === bookId

  return {
    toggleWishlist,
    isToggling,
  }
}
