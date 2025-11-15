import { Corretora } from "@/@types/corretora"
import { bffApi } from "@/lib/axios"
import { AxiosError } from "axios"

export async function editCorretora({
  id,
  razaoSocial,
  nomeFantasia,
  codigoSusep,
  cepFormatado,
  endereco,
  numero,
  complemento,
  bairro,
  cidade,
  uf,
  email,
  telefone,
  telefoneSecundario,
  website,
  percentualImposto,
  observacoes,
  consentimentoLgpd,
}: Corretora.UpdateRequest) {
  const cep = cepFormatado.replace(/\D/g, "")

  try {
    await bffApi.put(`/corretoras/${id}`, {
      razaoSocial,
      nomeFantasia,
      codigoSusep,
      cep,
      endereco,
      numero,
      complemento: complemento === "" ? null : complemento,
      bairro,
      cidade,
      uf,
      email,
      telefone,
      telefoneSecundario: telefoneSecundario === "" ? null : telefoneSecundario,
      website: website === "" ? null : website,
      percentualImposto,
      observacoes: observacoes === "" ? null : observacoes,
      consentimentoLgpd,
    })
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
