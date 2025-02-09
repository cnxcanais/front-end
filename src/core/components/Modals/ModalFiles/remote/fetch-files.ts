import { Files } from "@/@types/files"
import { api } from "@/lib/axios"

export async function fetchFiles(
  account_id: string,
  queryParams?: { key: string; value: string }[]
) {
  try {
    const response = await api.get<Files.GetRequest>(
      `/file/account/${account_id}`,
      {
        params: {
          queryParams,
        },
      }
    )

    return response.data.files
  } catch (error) {
    throw error
  }
}
