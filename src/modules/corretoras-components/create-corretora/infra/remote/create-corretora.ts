import { Corretora } from "@/@types/corretora"
import { formatCep } from "@/core/utils/format-cep"
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
  percentualComissao,
  observacoes,
  consentimentoLgpd,
}: Corretora.CreateRequest) {
  const cnpjCpf = cnpjCpfFormatado.replace(/\D/g, "")
  const cep = cepFormatado.replace(/\D/g, "")
  const enderecoCompleto = `${endereco}, ${numero}, ${complemento || ""}, ${bairro}, ${cidade}/${uf}, CEP ${cepFormatado}`

  try {
    const { data } = await bffApi.post("/corretoras", {
      razaoSocial,
      nomeFantasia,
      cnpjCpf,
      cnpjCpfFormatado,
      codigoSusep,
      cep,
      cepFormatado,
      endereco,
      numero,
      complemento,
      bairro,
      cidade,
      uf,
      enderecoCompleto,
      email,
      telefone,
      telefoneSecundario,
      website,
      percentualComissao,
      observacoes,
      consentimentoLgpd,
    })

    return data.message
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
