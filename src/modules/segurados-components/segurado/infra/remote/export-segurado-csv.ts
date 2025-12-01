import { Segurado } from "@/@types/segurado"
import { bffApi } from "@/lib/axios"

export async function exportSegurados(filters?: Segurado.ExportRequest) {
  try {
    const { data } = await bffApi.get<Blob>(`/segurados/export`, {
      params: { page: 1, limit: 100, ...filters },
      responseType: "blob",
    })
    return data
  } catch (error) {
    console.info(error)
  }
}
