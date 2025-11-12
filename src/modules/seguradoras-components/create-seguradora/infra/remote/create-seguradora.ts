import { Seguradora } from "@/@types/seguradora"
import { bffApi } from "@/lib/axios"
import { AxiosError } from "axios"

export async function createSeguradora({
  razaoSocial,
  cnpj,
  codigoSusep,
  cep,
  endereco,
  numero,
  bairro,
  cidade,
  uf,
}: Seguradora.CreateRequest) {
  const cnpjOnlyNumbers = cnpj.replace(/\D/g, "")

  try {
    const { data } = await bffApi.post("/seguradoras", {
      razaoSocial,
      cnpj: cnpjOnlyNumbers,
      codigoSusep,
      cep,
      endereco,
      numero,
      bairro,
      cidade,
      uf,
    })

    return data.message
  } catch (error) {
    // all errors will return in a message property inside data
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
