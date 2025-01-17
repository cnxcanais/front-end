import { api } from "@/lib/axios"

export async function POST(request: Request) {
  const body = await request.json()

  const response = await api.post("/user/authenticate", {
    email: body.email,
    password: body.password,
  })

  console.log("RESPONSE AUTHENTICATION => ", response)

  return new Response("Hello, Next.js!", {
    status: 200,
    headers: { "Set-Cookie": `permissions=${""}` },
  })
}
