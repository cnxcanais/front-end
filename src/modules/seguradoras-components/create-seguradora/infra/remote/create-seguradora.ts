import { Seguradora } from "@/@types/seguradora"
import { bffApi } from "@/lib/axios"
import { AxiosError } from "axios"

export async function createSeguradora({
  cnpj,
  fantasia,
  calculoDesconto,
  diretor,
  gerente,
  website,
  email,
  telefone,
  telefoneSecundario,
  telefoneAssistencia24h,
  observacoes,
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
    const { data } = await bffApi.post("/seguradoras", {
      cnpj: cnpjOnlyNumbers,
      fantasia: fantasia === "" ? null : fantasia,
      calculoDesconto: calculoDesconto === "" ? null : calculoDesconto,
      diretor: diretor === "" ? null : diretor,
      gerente: gerente === "" ? null : gerente,
      website: website === "" ? null : website,
      email: email === "" ? null : email,
      telefone: telefone === "" ? null : telefoneOnlyNumbers,
      telefoneSecundario:
        telefoneSecundario === "" ? null : telefoneSecundarioOnlyNumbers,
      telefoneAssistencia24h:
        telefoneAssistencia24h === "" ? null : (
          telefoneAssistencia24hOnlyNumbers
        ),
      observacoes: observacoes === "" ? null : observacoes,
      ...rest,
    })

    return data.message
  } catch (error) {
    // all errors will return in a message property inside data
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
