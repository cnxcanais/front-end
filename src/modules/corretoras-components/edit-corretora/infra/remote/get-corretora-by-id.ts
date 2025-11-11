import { Corretora } from "@/@types/corretora"
import { bffApi } from "@/lib/axios"

export async function getCorretoraById(id: string) {
  try {
    const { data } = await bffApi.get<Corretora.GetByIdResponse>(
      `/corretoras/${id}`
    )
    return data
  } catch (error) {
    console.info(error)
  }
}
