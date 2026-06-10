"use client"

import { cn } from "@/lib/utils"
import { useEffect, useMemo, useRef } from "react"
import { Button } from "../ui/button"
import { ArrowRight } from "lucide-react"

export type SearchInputProps = {
  className?: string
  value?: string
  onChange?: (value: string) => void
}

export function SearchInput({ className, value, onChange }: SearchInputProps) {
  const hasInput = useMemo(() => {
    return value?.length && value.length > 0
  }, [value])

  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.focus()
    }
  }, [])

  return (
    <div
      className={cn(
        "relative flex items-center gap-2 overflow-hidden rounded-full bg-background px-6 py-3 ring-2 ring-transparent transition-all duration-300 outline-none focus-within:ring-2 focus-within:ring-primary",
        className
      )}
    >
      <input
        ref={ref}
        type="text"
        placeholder="Search for a book?"
        className="w-full bg-transparent text-foreground outline-none"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />

      <Button
        type="submit"
        size="icon"
        tabIndex={hasInput ? 0 : -1}
        className={cn(
          "absolute right-2 translate-y-12 rounded-full transition-all duration-300",
          hasInput && "translate-y-0"
        )}
      >
        <ArrowRight className="size-4" />
      </Button>
    </div>
  )
}
