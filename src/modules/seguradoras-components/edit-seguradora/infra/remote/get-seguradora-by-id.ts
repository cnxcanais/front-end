import { Seguradora } from "@/@types/seguradora"
import { bffApi } from "@/lib/axios"

export async function getSeguradoraById(id: string) {
  try {
    const { data } = await bffApi.get<Seguradora.GetByIdResponse>(
      `/seguradoras/${id}`
    )

    return data
  } catch (error) {
    console.info(error)
  }
}
