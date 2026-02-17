import { Comissao } from "@/@types/comissao"
import { usePropostaQuery } from "@/modules/propostas-components/propostas/infra/hooks/use-proposta-query"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { getComissoes } from "../remote"

export function useComissaoQuery(
  page: number,
  limit: number,
  filters?: Record<string, string>
) {
  const { data: propostas } = usePropostaQuery(1, -1, {})

  const comissoesQuery = useQuery({
    queryKey: ["comissoes", page, limit, filters],
    queryFn: () => getComissoes(page, limit, filters),
  })

  const enrichedData = useMemo(() => {
    if (!comissoesQuery.data || !propostas) return null

    const enrichedItems: Comissao.Type[] = comissoesQuery.data.data.map(
      (comissao) => {
        const proposta = propostas.data.find(
          (p) => p.id === comissao.propostaApoliceId
        )
        const parcela = proposta?.parcelas?.find(
          (p) => p.id === comissao.parcelaId
        )

        const valorPago =
          comissao.situacao === "Paga" ? comissao.valorComissao : 0
        const valorPendente =
          (
            comissao.situacao === "Pendente" ||
            comissao.situacao === "Provisionada"
          ) ?
            comissao.valorComissao
          : 0

        const hoje = new Date()
        const vencimento =
          parcela?.dataVencimento ? new Date(parcela.dataVencimento) : hoje
        const diasAtraso =
          vencimento < hoje ?
            Math.floor(
              (hoje.getTime() - vencimento.getTime()) / (1000 * 60 * 60 * 24)
            )
          : 0

        return {
          ...comissao,
          seguradoNome: proposta?.seguradoNome || "-",
          numeroApolice: proposta?.numeroApolice || "-",
          numeroParcela: parcela?.numeroParcela?.toString() || "-",
          dataVencimento: parcela?.dataVencimento || "",
          premioLiquido: proposta?.premioLiquido || 0,
          comissaoTotal: comissao.valorComissao,
          valorPago,
          valorPendente,
          diasAtraso,
          corretoraId: proposta?.corretoraId || "",
          corretoraNome: proposta?.corretoraNome || "-",
          seguradoraId: proposta?.seguradoraId || "",
          seguradoraNome: proposta?.seguradoraNome || "-",
        }
      }
    )

    return {
      items: enrichedItems,
      total: comissoesQuery.data.total,
      page: comissoesQuery.data.page,
      limit: comissoesQuery.data.limit,
      totalPages: comissoesQuery.data.totalPages,
    }
  }, [comissoesQuery.data, propostas])

  return {
    ...comissoesQuery,
    data: enrichedData,
    isLoading: comissoesQuery.isLoading || !propostas,
  }
}
