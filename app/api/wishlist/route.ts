import {
  addBookToWishlist,
  getWishlistBookIds,
  removeBookFromWishlist,
} from "@/lib/db/queries"
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

  return NextResponse.json({ bookIds })
}

export async function POST(request: Request) {
  const sessionId = await getSessionId()

  if (!sessionId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const bookId = body.bookId

  if (!bookId || typeof bookId !== "string") {
    return NextResponse.json({ error: "Missing bookId" }, { status: 400 })
  }

  const { item, created } = await addBookToWishlist(sessionId, bookId)

  return NextResponse.json({ item }, { status: created ? 201 : 200 })
}

export async function DELETE(request: Request) {
  const sessionId = await getSessionId()

  if (!sessionId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const bookId = body.bookId

  if (!bookId || typeof bookId !== "string") {
    return NextResponse.json({ error: "Missing bookId" }, { status: 400 })
  }

  const { item, removed } = await removeBookFromWishlist(sessionId, bookId)

  if (!removed) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json({ item })
}
