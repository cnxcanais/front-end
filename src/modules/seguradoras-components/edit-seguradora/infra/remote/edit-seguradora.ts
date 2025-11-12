import { Seguradora } from "@/@types/seguradora"
import { bffApi } from "@/lib/axios"
import { AxiosError } from "axios"

export async function editSeguradora({
  id,
  razaoSocial,
  codigoSusep,
  cep,
  endereco,
  numero,
  bairro,
  cidade,
  uf,
}: Seguradora.UpdateRequest) {
  try {
    await bffApi.put(`/seguradoras/${id}`, {
      razaoSocial,
      codigoSusep,
      cep,
      endereco,
      numero,
      bairro,
      cidade,
      uf,
    })
  } catch (error) {
    // all errors will return in a message property inside data
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
