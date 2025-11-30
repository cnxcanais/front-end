import { Files } from "@/@types/files"
import { bffApi } from "@/lib/axios"

export async function saveFile({
  files,
  entity,
  entityId,
}: Files.CreateRequest) {
  const formData = new FormData()

  formData.append("entity", entity)
  formData.append("entityId", entityId)

  const filesArray = Array.isArray(files) ? files : [files]

  filesArray.forEach((file) => formData.append("files", file))

  try {
    await bffApi.post(`/files/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  } catch (error) {
    throw error
  }
}
