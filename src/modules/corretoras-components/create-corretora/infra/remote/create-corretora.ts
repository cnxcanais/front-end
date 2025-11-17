import { Corretora } from "@/@types/corretora"
import { bffApi } from "@/lib/axios"
import { AxiosError } from "axios"

export async function createCorretora({
  cnpjCpfFormatado,
  cepFormatado,
  complemento,
  telefoneSecundario,
  website,
  observacoes,
  ...rest
}: Corretora.CreateRequest) {
  const cnpjCpf = cnpjCpfFormatado.replace(/\D/g, "")
  const cep = cepFormatado.replace(/\D/g, "")

  try {
    const { data } = await bffApi.post("/corretoras", {
      cnpjCpf: cnpjCpf,
      cep: cep,
      complemento: complemento === "" ? null : complemento,
      telefoneSecundario: telefoneSecundario === "" ? null : telefoneSecundario,
      website: website === "" ? null : website,
      observacoes: observacoes === "" ? null : observacoes,
      ...rest,
    })

    return data.message
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
