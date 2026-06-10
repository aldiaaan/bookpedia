import { searchBooks } from "@/lib/gcloud/books"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Missing q parameter" }, { status: 400 })
  }

  const result = await searchBooks({ query })

  return NextResponse.json(result)
}
