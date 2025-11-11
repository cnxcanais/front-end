import { Seguradora } from "@/@types/seguradora"
import { formatCep } from "@/core/utils/format-cep"
import { bffApi } from "@/lib/axios"
import { AxiosError } from "axios"

export async function createSeguradora({
  razaoSocial,
  cnpjFormatado,
  codigoSusep,
  cep,
  endereco,
  numero,
  bairro,
  cidade,
  uf,
}: Seguradora.CreateRequest) {
  const cnpjOnlyNumbers = cnpjFormatado.replace(/\D/g, "")
  const cepFormatted = formatCep(cep)
  const enderecoCompletoFormatted = `${endereco}, ${numero}, ${bairro}, ${cidade}, ${uf}, ${cep}`

  try {
    const { data } = await bffApi.post("/seguradoras", {
      razaoSocial,
      cnpj: cnpjOnlyNumbers,
      cnpjFormatado,
      codigoSusep,
      cep,
      cepFormatado: cepFormatted,
      endereco,
      numero,
      bairro,
      cidade,
      uf,
      enderecoCompleto: enderecoCompletoFormatted,
    })

    return data.message
  } catch (error) {
    // all errors will return in a message property inside data
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
