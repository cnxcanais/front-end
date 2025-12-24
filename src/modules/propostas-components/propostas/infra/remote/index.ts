import { bffApi } from "@/lib/axios"
import {
  SituacaoEnum,
  TipoDocumentoEnum,
} from "@/modules/propostas-components/types/enums"
import { toast } from "sonner"
import {
  Proposta,
  PropostasResponse,
  UltimoEndossoResponse,
} from "../../../../../@types/proposta"

export async function getPropostas(
  page = 1,
  limit = 10,
  filters?: Record<string, string>
) {
  try {
    const response = await bffApi.get<PropostasResponse>(
      "/propostas-apolices",
      {
        params: { page, limit, ...filters },
      }
    )
    return response.data
  } catch (error: any) {
    toast.error(
      "Erro ao buscar propostas: " + error?.response?.data?.message ||
        "Erro ao buscar propostas"
    )
    throw error
  }
}

export async function getProposta(id: string) {
  try {
    const response = await bffApi.get<Proposta>(`/propostas-apolices/${id}`)
    return response.data
  } catch (error: any) {
    toast.error(
      "Erro ao buscar proposta: " + error?.response?.data?.message ||
        "Erro ao buscar proposta"
    )
    throw error
  }
}

export async function getUltimoEndosso(id: string) {
  try {
    const response = await bffApi.get<UltimoEndossoResponse>(
      `/propostas-apolices/${id}/ultimo-endosso`
    )
    return response.data
  } catch (error: any) {
    toast.error(
      "Erro ao buscar proposta: " + error?.response?.data?.message ||
        "Erro ao buscar proposta"
    )
    throw error
  }
}

export async function createProposta(data: any) {
  try {
    const response = await bffApi.post<Proposta>("/propostas-apolices", data)
    return response.data
  } catch (error: any) {
    toast.error(
      "Erro ao criar proposta: " + error?.response?.data?.message ||
        "Erro ao criar proposta"
    )
    throw error
  }
}

export async function updateProposta(id: string, data: any) {
  try {
    const response = await bffApi.patch<Proposta>(
      `/propostas-apolices/${id}`,
      data
    )
    return response.data
  } catch (error: any) {
    toast.error(
      "Erro ao atualizar proposta: " + error?.response?.data?.message ||
        "Erro ao atualizar proposta"
    )
    throw error
  }
}

export async function removeProposta(id: string) {
  try {
    const response = await bffApi.delete(`/propostas-apolices/${id}`)
    return response.data
  } catch (error: any) {
    toast.error(
      "Erro ao deletar proposta: " + error?.response?.data?.message ||
        "Erro ao remover proposta"
    )
    throw error
  }
}

export async function refuseProposta(id: string) {
  await updateProposta(id, { situacao: SituacaoEnum.RECUSADA })
}

export async function naoRenovarApolice(
  id: string,
  motivoNaoRenovacao: string
) {
  await updateProposta(id, { situacao: "Não Renovada", motivoNaoRenovacao })
}

export async function cancelarApolice(
  id: string,
  data: {
    dataCancelamento: string
    motivoCancelamento: string
  }
) {
  await updateProposta(id, { ...data, situacao: "Cancelada" })
}

export async function emitirApolice(
  id: string,
  data: {
    dataEmissao: string
    numeroApolice: string
    inicioVigencia: string
    fimVigencia: string
  }
) {
  await updateProposta(id, {
    ...data,
    tipoDocumento: TipoDocumentoEnum.APOLICE,
  })
}

export async function exportPropostas(filters?: Record<string, string>) {
  try {
    const response = await bffApi.get("/propostas-apolices/export", {
      params: filters,
      responseType: "blob",
    })
    return response.data
  } catch (error: any) {
    toast.error(
      "Erro ao exportar propostas: " + error?.response?.data?.message ||
        "Erro ao exportar propostas"
    )
    throw error
  }
}

export async function importPropostas(file: File) {
  try {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("behavior", "UPDATE")
    const response = await bffApi.post("/propostas-apolices/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (error: any) {
    toast.error(
      "Erro ao importar propostas: " + error?.response?.data?.message ||
        "Erro ao importar propostas"
    )
    throw error
  }
}
