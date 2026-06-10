import { getWishlistBookIds } from "@/lib/db/queries"
import { searchBooks } from "@/lib/gcloud/books"
import { SESSION_COOKIE_NAME } from "@/lib/session"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

async function getSessionId() {
  return (await cookies()).get(SESSION_COOKIE_NAME)?.value
}

export async function GET() {
  const sessionId = await getSessionId()

  if (!sessionId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const bookIds = await getWishlistBookIds(sessionId)

  if (bookIds.length === 0) {
    return NextResponse.json({ items: [] })
  }

  const result = await searchBooks({ ids: bookIds })

  return NextResponse.json({
    items: result.items.map((book) => ({ ...book, isWishlisted: true })),
  })
}
