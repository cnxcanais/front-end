import { Corretora } from "@/@types/corretora"
import { emptyToNull } from "@/core/utils/emptyToNull"
import { bffApi } from "@/lib/axios"
import { AxiosError } from "axios"

export async function createCorretora({
  cnpjCpfFormatado,
  cepFormatado,
  complemento,
  telefoneSecundario,
  website,
  observacoes,
  telefone,
  celular,
  ...rest
}: Corretora.CreateRequest) {
  const cnpjCpf = cnpjCpfFormatado.replace(/\D/g, "")
  const cep = cepFormatado.replace(/\D/g, "")
  const telefoneNoNumbers = telefone.replace(/\D/g, "")
  const celularNoNumbers = celular.replace(/\D/g, "")
  const telefoneSecundarioNoNumbers = telefoneSecundario.replace(/\D/g, "")

  try {
    const payload = emptyToNull({
      cnpjCpf,
      cep,
      telefoneSecundario: telefoneSecundarioNoNumbers,
      telefone: telefoneNoNumbers,
      celular: celularNoNumbers,
      ...rest,
    })

    const { data } = await bffApi.post("/corretoras", payload)

    return data
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
