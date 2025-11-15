import { Corretora } from "@/@types/corretora"
import { bffApi } from "@/lib/axios"
import { AxiosError } from "axios"

export async function createCorretora({
  razaoSocial,
  nomeFantasia,
  cnpjCpfFormatado,
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
}: Corretora.CreateRequest) {
  const cnpjCpf = cnpjCpfFormatado.replace(/\D/g, "")
  const cep = cepFormatado.replace(/\D/g, "")

  try {
    const { data } = await bffApi.post("/corretoras", {
      razaoSocial,
      nomeFantasia,
      cnpjCpf,
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

    return data.message
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
