import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const cookieName = "auth"
  const permissionsCookie = request.cookies.get(cookieName)

  console.log(permissionsCookie)

  if (!permissionsCookie) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // const permissions = JSON.parse(permissionsCookie.value)

  // const requestedUrl = new URL(request.url).pathname
  // const hasAccess = permissions.urlAccess[requestedUrl]

  // if (!hasAccess) {
  //   return NextResponse.redirect(new URL("/access-denied", request.url))
  // }

  return NextResponse.next()
}

export const config = {
  matcher: ["/accounts/:path*", "/dashboard/:path*"],
}
