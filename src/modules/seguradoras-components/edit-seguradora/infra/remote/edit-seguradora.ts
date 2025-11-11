import { Seguradora } from "@/@types/seguradora"
import { formatCep } from "@/core/utils/format-cep"
import { bffApi } from "@/lib/axios"
import { AxiosError } from "axios"

export async function editSeguradora({
  id,
  razaoSocial,
  cnpjFormatado,
  codigoSusep,
  cep,
  endereco,
  numero,
  bairro,
  cidade,
  uf,
}: Seguradora.UpdateRequest) {
  const cnpjOnlyNumbers = cnpjFormatado.replace(/\D/g, "")
  const cepFormatted = formatCep(cep)
  const enderecoCompletoFormatted = `${endereco}, ${numero}, ${bairro}, ${cidade}, ${uf}, ${cep}`
  try {
    await bffApi.put(`/seguradoras/${id}`, {
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
  } catch (error) {
    // all errors will return in a message property inside data
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
