import { Corretora } from "@/@types/corretora"
import { bffApi } from "@/lib/axios"
import { AxiosError } from "axios"

export async function editCorretora({
  id,
  cepFormatado,
  complemento,
  telefoneSecundario,
  telefone,
  website,
  observacoes,
  ...rest
}: Corretora.UpdateRequest) {
  const cep = cepFormatado.replace(/\D/g, "")
  const telefoneFormatado = telefone.replace(/\D/g, "")
  const telefoneSecundarioFormatado = telefoneSecundario.replace(/\D/g, "")

  try {
    await bffApi.put(`/corretoras/${id}`, {
      cep: cep,
      complemento: complemento === "" ? null : complemento,
      telefoneSecundario:
        telefoneSecundario === "" ? null : telefoneSecundarioFormatado,
      website: website === "" ? null : website,
      observacoes: observacoes === "" ? null : observacoes,
      telefone: telefoneFormatado,
      ...rest,
    })
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
