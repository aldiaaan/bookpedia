import {
  GoogleBooksResponse,
  GoogleBooksVolume,
  SearchBook,
  SearchBooksOptions,
} from "./types"

const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes"
const GOOGLE_CLOUD_API_KEY = process.env.GOOGLE_CLOUD_API_KEY!

export async function searchBooks(
  options: SearchBooksOptions
): Promise<{ items: SearchBook[] }> {
  if ("ids" in options) {
    if (options.ids.length === 0) {
      return { items: [] }
    }

    const volumes = await Promise.all(
      options.ids.map(async (id) => {
        const url = new URL(`${GOOGLE_BOOKS_API_URL}/${id}`)
        url.searchParams.set("key", GOOGLE_CLOUD_API_KEY)

        const response = await fetch(url)

        if (response.status === 404) {
          return null
        }

        if (!response.ok) {
          throw new Error(`Google Books API error: ${response.status}`)
        }

        return (await response.json()) as GoogleBooksVolume
      })
    )

    return {
      items: volumes
        .filter((volume): volume is GoogleBooksVolume => volume !== null)
        .map((volume) => {
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
          }
        }),
    }
  }

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
      }
    }),
  }
}
