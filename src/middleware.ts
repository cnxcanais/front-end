import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const permissionsCookie = request.cookies.get("path_permissions")

  if (!permissionsCookie) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  const requestedUrl = new URL(request.url).pathname

  const parsedUrlValues = JSON.parse(permissionsCookie.value)

  const hasAccess = parsedUrlValues[requestedUrl]

  if (!hasAccess) {
    return NextResponse.redirect(new URL("/unauthorized", request.url))
  }

  const cookieMaxAge = 60 * 60 * 24

  const response = NextResponse.next()

  response.cookies.set("auth", "", {
    path: "/",
    expires: cookieMaxAge,
    httpOnly: true,
  })

  return response
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/accounts/:path*",
    "/income-groups/:path*",
    "/income-sources/:path*",
    "/incomes/:path*",
    "/banks/:path*",
    "/banks/accounts/:path*",
    "/budget/incomes/:path*",
    "/budget/expenses/:path*",
    "/expense-categories/:path*",
    "/expense-details/:path*",
    "/expense-groups/:path*",
    "/income-categories/:path*",
    "/income-details/:path*",
    "/suppliers/:path*",
    "/users/:path*",
    "/permissions/:path*",
    "/reports/:path*",
    "/organizations/:path*",
    "/expenses/:path*",
  ],
}
