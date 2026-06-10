"use client"

import { SearchInput } from "@/components/search/search-input"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Page() {
  const [query, setQuery] = useState("")

  const router = useRouter()

  return (
    <div className="flex min-h-svh items-center justify-center bg-secondary">
      <div className="mx-auto w-full max-w-2xl">
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
  )
}
