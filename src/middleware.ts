import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // const permissionsCookie = JSON.stringify({
  //   id: "a3e1e4a3-9f7e-4e6b-9e1c-9f7e4e6b9e1c",
  //   name: "ADMIN",
  //   urlAccess: {
  //     "/dashboard": true,
  //     "/accounts": true,
  //     "/accounts/create": true,
  //     "/accounts/edit": true,
  //   },
  //   componentAccess: {
  //     "dashboard-button": true,
  //   },
  // })

  // if (!permissionsCookie) {
  //   return NextResponse.redirect(new URL("/login", request.url))
  // }

  // const permissions = JSON.parse(permissionsCookie)

  // const requestedUrl = new URL(request.url).pathname

  // const hasAccess = permissions.urlAccess[requestedUrl]

  // if (!hasAccess) {
  //   return NextResponse.redirect(new URL("/unauthorized", request.url))
  // }

  return NextResponse.next()
}

// export const config = {
//   matcher: ["/dashboard/:path*"],
// }
