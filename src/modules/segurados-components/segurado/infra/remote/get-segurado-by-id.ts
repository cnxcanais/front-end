import { Segurado } from "@/@types/segurado"
import { bffApi } from "@/lib/axios"

export async function getSeguradoById(id: string) {
  try {
    const { data } = await bffApi.get<Segurado.GetByIdResponse>(
      `/segurados/${id}`
    )
    return data
  } catch (error) {
    console.info(error)
  }
}
