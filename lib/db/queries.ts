import { and, eq } from "drizzle-orm"

import { db } from "./index"
import { wishlistTable } from "./schema"

export async function getWishlistBookIds(sessionId: string) {
  const items = await db
    .select({ bookId: wishlistTable.book_id })
    .from(wishlistTable)
    .where(eq(wishlistTable.session_id, sessionId))

  return items.map((item) => item.bookId)
}

export async function getWishlistItem(sessionId: string, bookId: string) {
  const [item] = await db
    .select()
    .from(wishlistTable)
    .where(
      and(
        eq(wishlistTable.session_id, sessionId),
        eq(wishlistTable.book_id, bookId)
      )
    )
    .limit(1)

  return item
}

export async function insertWishlistItem(sessionId: string, bookId: string) {
  const [item] = await db
    .insert(wishlistTable)
    .values({
      book_id: bookId,
      session_id: sessionId,
    })
    .returning()

  return item
}

export async function addBookToWishlist(sessionId: string, bookId: string) {
  const existing = await getWishlistItem(sessionId, bookId)

  if (existing) {
    return { item: existing, created: false as const }
  }

  const item = await insertWishlistItem(sessionId, bookId)

  return { item, created: true as const }
}

export async function removeWishlistItem(sessionId: string, bookId: string) {
  const [item] = await db
    .delete(wishlistTable)
    .where(
      and(
        eq(wishlistTable.session_id, sessionId),
        eq(wishlistTable.book_id, bookId)
      )
    )
    .returning()

  return item
}

export async function removeBookFromWishlist(sessionId: string, bookId: string) {
  const item = await removeWishlistItem(sessionId, bookId)

  return { item, removed: !!item }
}
