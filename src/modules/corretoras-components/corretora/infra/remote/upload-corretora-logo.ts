import { bffApi } from "@/lib/axios"
import { AxiosError } from "axios"
import { toast } from "sonner"

export async function uploadLogoCorretora(id: string, file: File) {
  const maxSizeInBytes = 500 * 1024 // 500KB

  if (file.size > maxSizeInBytes) {
    toast.error("O logo deve ter no máximo 500KB")
    return
  }

  try {
    const formData = new FormData()
    formData.append("logo", file)
    formData.append("id", id)

    const response = await bffApi.post(`/corretoras/${id}/logo`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    toast.error(
      "Erro ao fazer upload do logo da corretora: " +
        error.response.data.message
    )
    throw error
  }
}
