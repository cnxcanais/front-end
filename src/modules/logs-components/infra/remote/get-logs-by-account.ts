import { Log } from "@/@types/logs"
import { api } from "@/lib/axios"

export async function getLogs(account_id: string) {
  try {
    const { data } = await api.get<Log.GetResponse>(
      `/account/${account_id}/logs`
    )

    return data.logs
  } catch (error) {
    console.info(error)
    throw error
  }
}
