import { Files } from "@/@types/files"
import { api } from "@/lib/axios"

export async function saveFile({
  account_id,
  files,
  income_source_id,
  supplier_id,
  expense_id,
  income_id,
}: Files.CreateRequest) {
  const formData = new FormData()

  formData.append("account_id", account_id)
  if (income_source_id) formData.append("income_source_id", income_source_id)
  if (supplier_id) formData.append("supplier_id", supplier_id)
  if (expense_id) formData.append("expense_id", expense_id)
  if (income_id) formData.append("income_id", income_id)

  const filesArray = Array.isArray(files) ? files : [files]

  filesArray.forEach((file) => formData.append("files", file))

  try {
    await api.post(`/file`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  } catch (error) {
    throw error
  }
}
