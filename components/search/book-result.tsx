import { SearchBooksResult } from "@/lib/gcloud/types"
import { cn } from "@/lib/utils"
import { Star } from "lucide-react"

export type BookResultProps = {
  book: SearchBooksResult["items"][number]
}

function StarRating({ rating }: { rating: number }) {
  const hasRating = rating > 0
  const normalizedRating = Math.min(Math.max(rating, 0), 5)

  return (
    <div
      className={cn(
        "mt-2 flex items-center gap-1.5 text-sm",
        !hasRating && "text-muted-foreground"
      )}
    >
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, index) => {
          const fill = Math.min(1, Math.max(0, normalizedRating - index))

          return (
            <span key={index} className="relative inline-flex size-4">
              <Star className="size-4 text-muted-foreground" />
              {fill > 0 && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${fill * 100}%` }}
                >
                  <Star className="size-4 fill-primary text-primary" />
                </span>
              )}
            </span>
          )
        })}
      </div>
      <span>{rating.toFixed(1)}</span>
    </div>
  )
}

export function BookResult({ book }: BookResultProps) {
  const image = book.images.thumbnail || book.images.sm

  return (
    <li className="flex gap-4 rounded-lg bg-background p-4">
      {image && (
        <img
          alt={book.title}
          src={image}
          className="aspect-[2/3] h-48 shrink-0 rounded object-cover"
        />
      )}
      <div className="min-w-0">
        <h2 className="font-serif text-xl leading-tight font-bold">
          {book.title}
        </h2>
        {book.authors.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {book.authors.join(", ")}
          </p>
        )}
        <StarRating rating={book.averageRating} />
      </div>
    </li>
  )
}
