import { api } from "@/lib/axios"

export async function POST(request: Request) {
  const body = await request.json()

  const response = await api.post("/user/authenticate", {
    email: body.email,
    password: body.password,
  })

  return new Response("Logged in successfully!", {
    status: 200,
    headers: { "Set-Cookie": `authInfo=${JSON.stringify(response.data)}` },
  })
}
