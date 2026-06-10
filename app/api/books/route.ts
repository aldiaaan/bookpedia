import { getWishlistBookIds } from "@/lib/db/queries"
import { searchBooks } from "@/lib/gcloud/books"
import { SESSION_COOKIE_NAME } from "@/lib/session"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Missing q parameter" }, { status: 400 })
  }

  const result = await searchBooks({ query })
  const sessionId = (await cookies()).get(SESSION_COOKIE_NAME)?.value
  const wishlistBookIds = sessionId
    ? await getWishlistBookIds(sessionId)
    : []
  const wishlistSet = new Set(wishlistBookIds)

  return NextResponse.json({
    items: result.items.map((item) => ({
      ...item,
      isWishlisted: wishlistSet.has(item.id),
    })),
  })
}
