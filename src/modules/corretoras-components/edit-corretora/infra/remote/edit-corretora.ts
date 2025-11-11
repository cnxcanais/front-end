import { Corretora } from "@/@types/corretora"
import { formatCep } from "@/core/utils/format-cep"
import { bffApi } from "@/lib/axios"
import { AxiosError } from "axios"

export async function editCorretora({
  id,
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
}: Corretora.UpdateRequest) {
  const cnpjCpf = cnpjCpfFormatado.replace(/\D/g, "")
  const cep = cepFormatado.replace(/\D/g, "")
  const enderecoCompleto = `${endereco}, ${numero}, ${complemento || ""}, ${bairro}, ${cidade}/${uf}, CEP ${cepFormatado}`

  try {
    await bffApi.put(`/corretoras/${id}`, {
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
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
