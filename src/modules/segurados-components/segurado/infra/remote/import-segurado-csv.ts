import { Segurado } from "@/@types/segurado"
import { bffApi } from "@/lib/axios"

export async function importSegurados(file: File) {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("duplicationBehavior", "SKIP")

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
}
