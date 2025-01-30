import { api } from "@/lib/axios"

export async function removeFile(file_key: string) {
  try {
    await api.delete(`/file/${file_key}`)
  } catch (error) {
    throw error
  }
}
