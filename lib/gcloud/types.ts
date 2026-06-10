export type SearchBook = {
  id: string
  title: string
  description: string
  images: {
    sm: string
    thumbnail: string
  }
  authors: string[]
  averageRating: number
}

export type SearchBooksResult = {
  items: (SearchBook & { isWishlisted: boolean })[]
}

export type SearchBooksOptions = {
  query: string
}

export type GoogleBooksVolume = {
  id: string
  volumeInfo: {
    title: string
    description?: string
    authors?: string[]
    averageRating?: number
    imageLinks?: {
      smallThumbnail?: string
      thumbnail?: string
    }
  }
}

export type GoogleBooksResponse = {
  items?: GoogleBooksVolume[]
}
