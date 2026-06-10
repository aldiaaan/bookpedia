import {
  GoogleBooksResponse,
  SearchBook,
  SearchBooksOptions,
} from "./types"

const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes"
const GOOGLE_CLOUD_API_KEY = process.env.GOOGLE_CLOUD_API_KEY!

export async function searchBooks(
  options: SearchBooksOptions
): Promise<{ items: SearchBook[] }> {
  const url = new URL(GOOGLE_BOOKS_API_URL)
  url.searchParams.set("q", options.query)
  url.searchParams.set("key", GOOGLE_CLOUD_API_KEY)

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Google Books API error: ${response.status}`)
  }

  const data = (await response.json()) as GoogleBooksResponse

  return {
    items: (data.items ?? []).map((volume) => {
      const { volumeInfo } = volume

      const averageRating = volumeInfo.averageRating ?? 0

      return {
        id: volume.id,
        title: volumeInfo.title,
        description: volumeInfo.description ?? "",
        images: {
          sm: volumeInfo.imageLinks?.smallThumbnail ?? "",
          thumbnail: volumeInfo.imageLinks?.thumbnail ?? "",
        },
        authors: volumeInfo.authors?.map((author) => author) ?? [],
        averageRating,
        averageRatingFormatted: `${averageRating.toFixed(1)}`,
      }
    }),
  }
}
