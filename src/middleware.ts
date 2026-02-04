import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  const response = NextResponse.next()
  const cookieMaxAge = 60 * 60 * 24
  response.cookies.set("token", token, {
    maxAge: cookieMaxAge,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
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
    "/logs/:path*",
  ],
}
