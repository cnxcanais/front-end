import { Segurado } from "@/@types/segurado"
import { bffApi } from "@/lib/axios"
import { toast } from "sonner"

export async function exportSegurados(filters?: Segurado.ExportRequest) {
  try {
    const { data } = await bffApi.get<Blob>(`/segurados/export`, {
      params: { ...filters },
      responseType: "blob",
    })
    return data
  } catch (error) {
    toast.error("Erro ao exportar segurado " + error.message)
    console.info(error)
  }
}
