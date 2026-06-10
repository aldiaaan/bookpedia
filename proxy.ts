import { NextRequest, NextResponse } from "next/server"

const SESSION_COOKIE_NAME = "session_id"

export function proxy(request: NextRequest) {
  const hasSession = request.cookies.get(SESSION_COOKIE_NAME)

  if (hasSession) {
    return NextResponse.next()
  }

  const sesionId = crypto.randomUUID()

  const response = NextResponse.next()

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: sesionId,
    httpOnly: true,
    secure: false,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
  })

  return response
}

export const config = {
  matcher:
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
}
