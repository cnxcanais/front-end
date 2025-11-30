import { bffApi } from "@/lib/axios"

export async function removeFile(file_key: string) {
  try {
    await bffApi.delete(`/files/${file_key}`)
  } catch (error) {
    throw error
  }
}
