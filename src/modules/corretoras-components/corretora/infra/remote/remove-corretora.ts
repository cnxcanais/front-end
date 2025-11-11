import { bffApi } from "@/lib/axios"

export async function removeCorretora(id: string) {
  const { data } = await bffApi.delete(`/corretoras/${id}`)
  return data
}
