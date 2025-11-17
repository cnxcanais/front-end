import { Seguradora } from "@/@types/seguradora"
import { bffApi } from "@/lib/axios"
import { AxiosError } from "axios"

export async function createSeguradora({
  razaoSocial,
  cnpj,
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
  telefoneAssistencia24h,
  observacoes,
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
      telefoneAssistencia24h:
        telefoneAssistencia24h === "" ? null : telefoneAssistencia24h,
      observacoes: observacoes === "" ? null : observacoes,
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
