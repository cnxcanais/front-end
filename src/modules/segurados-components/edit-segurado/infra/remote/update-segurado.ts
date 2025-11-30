import { Segurado } from "@/@types/segurado"
import { emptyToNull } from "@/core/utils/emptyToNull"
import { bffApi } from "@/lib/axios"
import { AxiosError } from "axios"

export async function updateSegurado(
  id: string,
  { telefone, celular, ...rest }: Segurado.UpdateRequest
) {
  try {
    const telefoneOnlyNumber = telefone?.replace(/\D/g, "")
    const celularOnlyNumber = celular?.replace(/\D/g, "")

    const payload = emptyToNull({
      ...rest,
      telefone: telefoneOnlyNumber,
      celular: celularOnlyNumber,
    })

    const response = await bffApi.put(`/segurados/${id}`, payload)
    return response.data.message
  } catch (error) {
    if (error instanceof AxiosError) throw error.response?.data?.message
    throw error
  }
}
