import { bffApi } from "@/lib/axios"

export async function getMe() {
  const response = await bffApi.get("/auth/me")
  return response.data
}

export async function getAvatarUrl() {
  const response = await bffApi.get("/me/avatar-url")
  return response.data
}

export async function uploadAvatar(file: File) {
  const formData = new FormData()
  formData.append("avatar", file)

  const response = await bffApi.post("/me/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return response.data
}
