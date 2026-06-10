import { getWishlistBookIds } from "@/lib/db/queries"
import { searchBooks } from "@/lib/gcloud/books"
import { SESSION_COOKIE_NAME } from "@/lib/session"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  const idsParam = searchParams.get("ids")

  let result: Awaited<ReturnType<typeof searchBooks>>

  if (idsParam) {
    const ids = idsParam.split(",").map((id) => id.trim()).filter(Boolean)

    if (ids.length === 0) {
      return NextResponse.json({ error: "Invalid ids parameter" }, { status: 400 })
    }

    result = await searchBooks({ ids })
  } else if (query) {
    result = await searchBooks({ query })
  } else {
    return NextResponse.json(
      { error: "Missing q or ids parameter" },
      { status: 400 }
    )
  }
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
