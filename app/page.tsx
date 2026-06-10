"use client"

import { SearchInput } from "@/components/search/search-input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Page() {
  const [query, setQuery] = useState("")

  const router = useRouter()

  return (
    <div className="flex h-svh bg-secondary">
      <div className="relative mx-auto flex h-full w-full max-w-2xl items-center justify-center">
        <nav className="absolute top-0 right-0 left-0 flex items-center justify-end py-2">
          <Link
            className="font-serif tracking-tight font-bold text-muted-foreground hover:text-primary hover:underline"
            href="/wishlist"
          >
            Wishlist
          </Link>
        </nav>
        <div className="w-full">
          <p className="text-center font-serif text-6xl font-bold tracking-tight">
            Bookpedia
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              router.push(`/search?q=${encodeURIComponent(query)}`)
            }}
          >
            <SearchInput
              className="mt-12"
              value={query ?? ""}
              onChange={setQuery}
            />
          </form>
        </div>
      </div>
    </div>
  )
}
