import { Corretora } from "@/@types/corretora"
import { emptyToNull } from "@/core/utils/emptyToNull"
import { bffApi } from "@/lib/axios"
import { AxiosError } from "axios"

export async function editCorretora({
  id,
  cepFormatado,
  telefoneSecundario,
  telefone,
  ...rest
}: Corretora.UpdateRequest) {
  const cep = cepFormatado.replace(/\D/g, "")
  const telefoneFormatado = telefone.replace(/\D/g, "")
  const telefoneSecundarioFormatado = telefoneSecundario.replace(/\D/g, "")

  try {
    const payload = emptyToNull({
      cep,
      telefoneSecundario: telefoneSecundarioFormatado,
      telefone: telefoneFormatado,
      ...rest,
    })

    await bffApi.put(`/corretoras/${id}`, payload)
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
