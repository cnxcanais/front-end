import { Seguradora } from "@/@types/seguradora"
import { emptyToNull } from "@/core/utils/emptyToNull"
import { bffApi } from "@/lib/axios"
import { AxiosError } from "axios"

export async function editSeguradora({
  id,
  telefone,
  telefoneSecundario,
  telefoneAssistencia24h,
  ...rest
}: Seguradora.UpdateRequest) {
  try {
    const telefoneOnlyNumbers = telefone.replace(/\D/g, "")
    const telefoneSecundarioOnlyNumbers = telefoneSecundario.replace(/\D/g, "")
    const telefoneAssistencia24hOnlyNumbers = telefoneAssistencia24h.replace(
      /\D/g,
      ""
    )

    const payload = emptyToNull({
      telefone: telefoneOnlyNumbers,
      telefoneSecundario: telefoneSecundarioOnlyNumbers,
      telefoneAssistencia24h: telefoneAssistencia24hOnlyNumbers,
      ...rest,
    })

    await bffApi.put(`/seguradoras/${id}`, payload)
  } catch (error) {
    // all errors will return in a message property inside data
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
