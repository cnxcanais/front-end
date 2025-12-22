import { Segurado } from "@/@types/segurado"
import { bffApi } from "@/lib/axios"
import { toast } from "sonner"

export async function importSegurados(file: File) {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("duplicationBehavior", "UPDATE")

  try {
    const { data } = await bffApi.post<Segurado.ImportRequest>(
      `/segurados/import`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    return data
  } catch (error) {
    toast.error("Erro ao importar segurados")
    console.log(error)
  }
}
