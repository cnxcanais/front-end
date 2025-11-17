import { Seguradora } from "@/@types/seguradora"
import { bffApi } from "@/lib/axios"
import { AxiosError } from "axios"

export async function editSeguradora({
  id,
  razaoSocial,
  codigoSusep,
  fantasia,
  grupo,
  impostoRetido,
  habilitarJuros,
  calculoDesconto,
  calculoDescontoPadrao,
  diretor,
  gerente,
  website,
  email,
  telefone,
  telefoneSecundario,
  telefoneAssitencia24h,
  observacoes,
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
      fantasia: fantasia === "" ? null : fantasia,
      grupo: grupo === "" ? null : grupo,
      impostoRetido,
      habilitarJuros,
      calculoDesconto: calculoDesconto === "" ? null : calculoDesconto,
      calculoDescontoPadrao,
      diretor: diretor === "" ? null : diretor,
      gerente: gerente === "" ? null : gerente,
      website: website === "" ? null : website,
      email: email === "" ? null : email,
      telefone: telefone === "" ? null : telefone,
      telefoneSecundario: telefoneSecundario === "" ? null : telefoneSecundario,
      telefoneAssistencia24h: telefoneAssitencia24h === "" ? null : telefoneAssitencia24h,
      observacoes: observacoes === "" ? null : observacoes,
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
