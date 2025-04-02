import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const permissionsCookie = request.cookies.get("path_permissions")?.value
  const token = request.cookies.get("token")?.value

  if (!permissionsCookie || !token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  const requestedUrl = new URL(request.url).pathname
  const parsedUrlValues = JSON.parse(permissionsCookie)

  // Verifica acesso diretamente por correspondência exata
  if (parsedUrlValues[requestedUrl]) {
    // Permissão encontrada diretamente
    const cookieMaxAge = 60 * 60 * 24
    const response = NextResponse.next()
    response.cookies.set("token", token, {
      maxAge: cookieMaxAge,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })
    return response
  }

  // Se não encontrou correspondência exata, tenta com pattern matching
  const urlSegments = requestedUrl.split("/").filter(Boolean) // Remove segmentos vazios

  // Itera sobre as permissões disponíveis para encontrar padrões compatíveis
  for (const permissionPath in parsedUrlValues) {
    if (!parsedUrlValues[permissionPath]) continue

    const permissionSegments = permissionPath.split("/").filter(Boolean)

    // Verifica se há um padrão de rota que poderia corresponder, considerando IDs
    if (isRoutePatternMatch(urlSegments, permissionSegments)) {
      const cookieMaxAge = 60 * 60 * 24
      const response = NextResponse.next()
      response.cookies.set("token", token, {
        maxAge: cookieMaxAge,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      })
      return response
    }
  }

  // Nenhuma permissão encontrada
  return NextResponse.redirect(new URL("/unauthorized", request.url))
}

// Função para verificar se uma rota requisitada corresponde a um padrão de permissão
function isRoutePatternMatch(
  urlSegments: string[],
  permissionSegments: string[]
): boolean {
  const crudOperations = ["edit"]

  // Caso 1: Rota exata com mesmo número de segmentos
  if (urlSegments.length === permissionSegments.length) {
    return urlSegments.every(
      (segment, index) => segment === permissionSegments[index]
    )
  }

  // Caso 2: Rota com ID no final (ex: /users/abc123)
  if (urlSegments.length === permissionSegments.length + 1) {
    // Verifica se todos os segmentos, exceto o último, correspondem
    for (let i = 0; i < permissionSegments.length; i++) {
      if (urlSegments[i] !== permissionSegments[i]) return false
    }
    return true // O último segmento é considerado um ID
  }

  // Caso 3: Rota com operação CRUD e ID (ex: /users/edit/abc123 ou /users/abc123/edit)
  if (urlSegments.length === permissionSegments.length + 2) {
    // Verifica se há uma operação CRUD na URL
    const hasCrudOp = urlSegments.some((segment) =>
      crudOperations.includes(segment)
    )
    if (!hasCrudOp) return false

    // Verifica se o caminho base corresponde, ignorando o ID e a operação CRUD
    let baseMatches = true
    for (let i = 0; i < permissionSegments.length; i++) {
      // Se este segmento é uma operação CRUD, pula
      if (crudOperations.includes(urlSegments[i])) continue

      // Se já passamos pelo segmento correspondente na permissão devido a um CRUD anterior, pula
      if (i >= permissionSegments.length) continue

      // Verifica correspondência do segmento
      if (urlSegments[i] !== permissionSegments[i]) {
        baseMatches = false
        break
      }
    }

    return baseMatches
  }

  return false
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
