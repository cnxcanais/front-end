import { Files } from "@/@types/files"
import { bffApi } from "@/lib/axios"

export async function fetchFiles(entityId: string, entityType: string) {
  try {
    const response = await bffApi.get<Files.GetRequest>(`/files`, {
      params: {
        entityId,
        entity: entityType,
      },
    })

    return response.data.files
  } catch (error) {
    throw error
  }
}
