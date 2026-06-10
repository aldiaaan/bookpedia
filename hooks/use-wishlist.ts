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

      const previous = queryClient.getQueriesData<SearchBooksResult>({
        queryKey: ["books"],
      })

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

      return { previous }
    },
    onError: (_error, _variables, context) => {
      context?.previous.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] })
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
