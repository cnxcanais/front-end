import { Seguradora } from "@/@types/seguradora"
import { emptyToNull } from "@/core/utils/emptyToNull"
import { bffApi } from "@/lib/axios"
import { AxiosError } from "axios"

export async function createSeguradora({
  cnpj,
  telefone,
  telefoneSecundario,
  telefoneAssistencia24h,
  ...rest
}: Seguradora.CreateRequest) {
  const cnpjOnlyNumbers = cnpj?.replace(/\D/g, "")
  const telefoneOnlyNumbers = telefone?.replace(/\D/g, "")
  const telefoneSecundarioOnlyNumbers = telefoneSecundario?.replace(/\D/g, "")
  const telefoneAssistencia24hOnlyNumbers = telefoneAssistencia24h?.replace(
    /\D/g,
    ""
  )

  try {
    const payload = emptyToNull({
      cnpj: cnpjOnlyNumbers,
      telefone: telefoneOnlyNumbers,
      telefoneSecundario: telefoneSecundarioOnlyNumbers,
      telefoneAssistencia24h: telefoneAssistencia24hOnlyNumbers,
      ...rest,
    })

    const { data } = await bffApi.post("/seguradoras", payload)

    return data
  } catch (error) {
    // all errors will return in a message property inside data
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
