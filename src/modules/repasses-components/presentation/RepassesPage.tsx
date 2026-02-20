"use client"

import { Repasse } from "@/@types/repasse"
import { Button } from "@/core/components/Button"
import { ExportTableToPDFButton } from "@/core/components/ExportPDFButton"
import { FilterField, FilterForm } from "@/core/components/FilterForm"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Pagination } from "@/core/components/Pagination"
import { Table } from "@/core/components/Table"
import { getCookie } from "@/lib/cookies"
import { useComissaoQuery } from "@/modules/comissoes-components/comissao/infra/hooks/use-comissao-query"
import { useCorretoraQuery } from "@/modules/corretoras-components/corretora/infra/hooks/use-corretora-query"
import { useProdutorQuery } from "@/modules/produtores-components/produtor/infra/hooks/use-produtor-query"
import { usePropostaQuery } from "@/modules/propostas-components/propostas/infra/hooks/use-proposta-query"
import { useSeguradoraQuery } from "@/modules/seguradoras-components/seguradora/infra/hooks/use-seguradora-query"
import { useUsuarioQuery } from "@/modules/usuarios-components/usuario/infra/hooks/use-usuario-query"
import {
  ArrowsClockwise,
  ArrowUUpLeft,
  CurrencyDollar,
  FileXls,
  Pencil,
} from "@phosphor-icons/react"
import { useMemo, useState } from "react"
import {
  useEstornarRepasseMutation,
  useMarkRepasseAsPagoMutation,
  useRepassesQuery,
  useReverterEstornoRepasseMutation,
  useUpdateRepasseValorMutation,
} from "../infra/hooks"
import { BaixaRepasseModal } from "./components/BaixaRepasseModal"
import { EditarValorRepasseModal } from "./components/EditarValorRepasseModal"
import { EstornoRepasseModal } from "./components/EstornoRepasseModal"
import { ReverterEstornoModal } from "./components/ReverterEstornoModal"

export function RepassesPage() {
  const { data: usuarios } = useUsuarioQuery()
  const corretoraId = getCookie("corretoraId")
  const userId = getCookie("userId")
  const user = usuarios?.data.find((u) => u.props?.id === userId)
  const isAdmin = user?.props?.perfilId === process.env.NEXT_PUBLIC_ADM_ID

  const [filters, setFilters] = useState<Record<string, string>>({})
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [baixaRepasse, setBaixaRepasse] = useState<Repasse.Type | null>(null)
  const [estornoRepasse, setEstornoRepasse] = useState<Repasse.Type | null>(
    null
  )
  const [editarRepasse, setEditarRepasse] = useState<Repasse.Type | null>(null)
  const [reverterEstorno, setReverterEstorno] = useState<Repasse.Type | null>(
    null
  )

  const standardFilters = isAdmin ? {} : { corretoraId: corretoraId || "" }
  const { data: seguradoras } = useSeguradoraQuery(1, -1, standardFilters)
  const { data: corretoras } = useCorretoraQuery(1, -1, standardFilters)
  const { data: produtores } = useProdutorQuery(1, -1, standardFilters)
  const { data: propostas } = usePropostaQuery(1, -1, standardFilters)
  const { data: repassesData, isLoading } = useRepassesQuery(page, limit, {
    ...filters,
    ...standardFilters,
  })
  const { data: comissoes } = useComissaoQuery(1, -1, standardFilters)

  const markPagoMutation = useMarkRepasseAsPagoMutation()
  const estornarMutation = useEstornarRepasseMutation()
  const updateValorMutation = useUpdateRepasseValorMutation()
  const reverterEstornoMutation = useReverterEstornoRepasseMutation()

  const handleFilter = (newFilters: Record<string, string>) => {
    setFilters(newFilters)
    setPage(1)
  }

  const filterFields: FilterField[] = useMemo(
    () => [
      {
        name: "seguradoraId",
        label: "Seguradora",
        type: "select",
        placeholder: "Selecione uma seguradora",
        options:
          seguradoras?.data.map((s) => ({
            label: s.razaoSocial,
            value: s.id,
          })) || [],
      },
      {
        name: "corretoraId",
        label: "Corretora",
        type: "select",
        placeholder: "Selecione uma corretora",
        options:
          isAdmin ?
            corretoras?.data.map((c) => ({
              label: c.razaoSocial,
              value: c.id,
            })) || []
          : corretoras?.data
              .filter((c) => c.id === corretoraId)
              .map((c) => ({
                label: c.razaoSocial,
                value: c.id,
              })) || [],
      },
      {
        name: "produtorId",
        label: "Produtor",
        type: "select",
        placeholder: "Selecione um produtor",
        options:
          produtores?.data.map((p) => ({ label: p.nome, value: p.id })) || [],
      },
      {
        name: "propostaApoliceId",
        label: "Apólice",
        type: "select",
        placeholder: "Selecione uma apólice",
        options:
          propostas?.data.map((p) => ({
            label: p.numeroApolice,
            value: p.id,
          })) || [],
      },
      {
        name: "comissaoId",
        label: "Comissão",
        type: "select",
        placeholder: "Selecione uma comissão",
        options:
          comissoes?.items.map((c) => ({
            label:
              c.numeroApolice +
              " - Parcela " +
              c.numeroParcela +
              " - Valor " +
              c.valorComissao.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              }),
            value: c.id,
          })) || [],
      },
      {
        name: "situacaoRepasse",
        label: "Situação",
        type: "select",
        placeholder: "Selecione uma situação",
        options: [
          { label: "Pendente", value: "Pendente" },
          { label: "Simulado", value: "Simulado" },
          { label: "Pago", value: "Pago" },
          { label: "Cancelado", value: "Cancelado" },
          { label: "Provisionado", value: "Provisionado" },
        ],
      },
      {
        name: "situacaoParcela",
        label: "Situação da Parcela",
        type: "select",
        placeholder: "Selecione uma situação",
        options: [
          { label: "Pendente", value: "Pendente" },
          { label: "Em Atraso", value: "Em Atraso" },
          { label: "Paga", value: "Paga" },
          { label: "Cancelada", value: "Cancelada" },
        ],
      },
      {
        name: "situacaoApolice",
        label: "Situação da Apólice",
        type: "select",
        placeholder: "Selecione a situação",
        options: [
          { label: "Ativo", value: "Ativo" },
          { label: "Inativo", value: "Inativo" },
          { label: "Recusada", value: "Recusada" },
          { label: "Renovada", value: "Renovada" },
          { label: "Não Renovada", value: "Não Renovada" },
          { label: "Cancelada", value: "Cancelada" },
        ],
      },

      {
        name: "apenasEstornos",
        label: "Apenas Estornos",
        type: "select",
        placeholder: "Selecione",
        options: [
          { label: "Sim", value: "true" },
          { label: "Não", value: "false" },
        ],
      },
      {
        name: "isLastroZero",
        label: "Apenas Lastro Zero",
        type: "select",
        placeholder: "Selecione",
        options: [
          { label: "Sim", value: "true" },
          { label: "Não", value: "false" },
        ],
      },
      {
        name: "dataEmissaoInicio",
        label: "Data Emissão (De)",
        type: "date",
      },
      {
        name: "dataEmissaoFim",
        label: "Data Emissão (Até)",
        type: "date",
      },
      {
        name: "dataVencimentoInicio",
        label: "Data Vencimento (De)",
        type: "date",
      },
      {
        name: "dataVencimentoFim",
        label: "Data Vencimento (Até)",
        type: "date",
      },
    ],
    [seguradoras, corretoras, produtores, propostas, isAdmin, corretoraId]
  )

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const generateCSV = () => {
    const headers = [
      "Produtor",
      "Apólice",
      "Base",
      "Tipo",
      "Percentual",
      "Valor Repasse",
      "Situação",
      "Nível",
    ]
    const csvRows = [
      headers.join(","),
      ...(rows.map((r: any) =>
        [
          r.produtorNome,
          r.numeroApolice,
          r.valorBaseRepasse,
          r.repasseSobre,
          `${r.percentualAplicado}%`,
          r.valorRepasse,
          r.situacao,
          r.nivelCadeia,
        ].join(",")
      ) || []),
    ]
    return csvRows.join("\n")
  }

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute(
      "download",
      `${filename}-${new Date().toLocaleDateString("pt-BR").replace(/\//g, "-")}.csv`
    )
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  }

  const handleBaixar = (id: string, dataPagamento: string) => {
    markPagoMutation.mutate(
      { id, dataPagamento },
      {
        onSuccess: () => setBaixaRepasse(null),
      }
    )
  }

  const handleEstornar = (
    registros: Array<{ registroOriginalId: string; valorEstorno: number }>,
    motivo: string
  ) => {
    estornarMutation.mutate(
      { registros, motivo },
      {
        onSuccess: () => setEstornoRepasse(null),
      }
    )
  }

  const handleEditarValor = (id: string, novoValor: number) => {
    updateValorMutation.mutate(
      { id, novoValor },
      {
        onSuccess: () => setEditarRepasse(null),
      }
    )
  }

  const handleReverterEstorno = (estornoIds: string[], motivo: string) => {
    reverterEstornoMutation.mutate(
      { estornoIds, motivo },
      {
        onSuccess: () => setReverterEstorno(null),
      }
    )
  }

  const getSituacaoColor = (situacao: string) => {
    const colors: Record<string, string> = {
      PENDENTE: "bg-yellow-100 text-yellow-800",
      Pendente: "bg-yellow-100 text-yellow-800",
      Provisionado: "bg-blue-100 text-blue-800",
      PARCIAL: "bg-blue-100 text-blue-800",
      PAGO: "bg-green-100 text-green-800",
      Pago: "bg-green-100 text-green-800",
      CANCELADO: "bg-gray-100 text-gray-800",
      Cancelado: "bg-gray-100 text-gray-800",
      ESTORNADO: "bg-red-100 text-red-800",
      Estornado: "bg-red-100 text-red-800",
      REVERTIDO: "bg-red-100 text-red-400",
      Revertido: "bg-red-100 text-red-400",
    }
    return colors[situacao] || "bg-gray-100 text-gray-800"
  }

  const getSituacaoParcelaColor = (situacao: string) => {
    const colors: Record<string, string> = {
      Cancelada: "bg-gray-100 text-gray-800",
      Pendente: "bg-blue-100 text-blue-800",
      "Em Atraso": "bg-red-100 text-red-800",
      Paga: "bg-green-100 text-green-800",
    }
    return colors[situacao] || "bg-gray-100 text-gray-800"
  }

  const columns = [
    {
      header: "Corretora",
      accessor: "corretora",
      render: (v: string, row: any) => (
        <span className={(row as any).isNested ? "pl-8" : ""}>
          {(row as any).isNested && "↳ "}
          {row.propostaApolice.corretoraNome}
        </span>
      ),
    },
    {
      header: "Seguradora",
      accessor: "seguradora",
      render: (v: string, row: Repasse.Type) => (
        <span>{row.propostaApolice.seguradoraNome}</span>
      ),
    },
    {
      header: "Apólice",
      accessor: "numeroApolice",
      render: (v: string, row: Repasse.Type) => (
        <span>{row.propostaApolice.numeroApolice}</span>
      ),
    },
    {
      header: "Segurado",
      accessor: "segurado",
      render: (v: string, row: Repasse.Type) => (
        <span>{row.propostaApolice.seguradoNome}</span>
      ),
    },
    { header: "Produtor", accessor: "produtorNome" },
    {
      header: "Parcela",
      accessor: "parcela",
      render: (v: string, row: Repasse.Type) => (
        <span>{row.parcela?.numeroParcela || "-"}</span>
      ),
    },
    {
      header: "Base",
      accessor: "valorBaseRepasse",
      render: (v: number) => formatCurrency(v),
    },
    {
      header: "Tipo",
      accessor: "repasseSobre",
      render: (v: string, row: Repasse.Type) => (
        <div className="text-xs">
          <div>{v}</div>
          <div className="text-gray-500">{row.percentualAplicado}%</div>
        </div>
      ),
    },
    {
      header: "Valor Repasse",
      accessor: "valorRepasse",
      render: (v: number) => (
        <span className={v < 0 ? "font-semibold text-red-600" : ""}>
          {formatCurrency(v)}
        </span>
      ),
    },
    {
      header: "Situação",
      accessor: "situacao",
      render: (v: string, row: Repasse.Type) => {
        let adjustedValue = v
        if (row.repasseEstornadoId && !row.isEstornoRevertido) {
          adjustedValue = "Estornado"
        } else if (row.repasseEstornadoId && row.isEstornoRevertido) {
          adjustedValue = "Revertido"
        }
        return (
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${getSituacaoColor(adjustedValue)}`}>
            {adjustedValue}
          </span>
        )
      },
    },
    {
      header: "Situação da Parcela",
      accessor: "parcela",
      render: (v: any, row: Repasse.Type) => {
        const situacao = row.parcela?.situacao || "-"
        if (situacao === "-") return situacao
        return (
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${getSituacaoParcelaColor(situacao)}`}>
            {situacao}
          </span>
        )
      },
    },
    { header: "Nível", accessor: "nivelCadeia" },
    {
      header: "Ações",
      accessor: "actions",
      render: (_: any, row: Repasse.Type) => (
        <div className="flex gap-1">
          {(row.situacao === "Provisionado" || row.situacao === "Pendente") &&
            isAdmin && (
              <button
                onClick={() => setEditarRepasse(row)}
                className="rounded p-1 text-blue-600 hover:bg-blue-50"
                title="Editar valor">
                <Pencil size={16} />
              </button>
            )}
          {row.situacao === "Pendente" && isAdmin && (
            <button
              onClick={() => setBaixaRepasse(row)}
              className="rounded p-1 text-green-600 hover:bg-green-50"
              title="Baixar repasse">
              <CurrencyDollar size={16} />
            </button>
          )}
          {row.situacao === "Pago" && !row.repasseEstornadoId && isAdmin && (
            <button
              onClick={() => setEstornoRepasse(row)}
              className="rounded p-1 text-red-600 hover:bg-red-50"
              title="Estornar">
              <ArrowsClockwise size={16} />
            </button>
          )}
          {row.repasseEstornadoId && !row.isEstornoRevertido && isAdmin && (
            <button
              onClick={() => setReverterEstorno(row)}
              className="rounded p-1 text-orange-600 hover:bg-orange-50"
              title="Reverter estorno">
              <ArrowUUpLeft size={16} />
            </button>
          )}
        </div>
      ),
    },
  ]

  const rows = useMemo(() => {
    if (!repassesData?.data) return []
    const mappedRows = repassesData.data.map((repasse: Repasse.Type) => {
      const produtor = produtores?.data.find((p) => p.id === repasse.produtorId)
      const proposta = propostas?.data.find(
        (p) => p.id === repasse.propostaApoliceId
      )
      return {
        ...repasse,
        produtorNome: produtor?.nome || "-",
        numeroApolice: proposta?.numeroApolice || "-",
        isNested: !!repasse.repasseEstornadoId,
      }
    })

    // Sort all rows together
    return [...mappedRows].sort((a, b) => {
      const corretoraA = a.propostaApolice?.corretoraNome || ""
      const corretoraB = b.propostaApolice?.corretoraNome || ""
      if (corretoraA !== corretoraB) return corretoraA.localeCompare(corretoraB)

      const seguradoraA = a.propostaApolice?.seguradoraNome || ""
      const seguradoraB = b.propostaApolice?.seguradoraNome || ""
      if (seguradoraA !== seguradoraB)
        return seguradoraA.localeCompare(seguradoraB)

      const apoliceA = a.propostaApolice?.numeroApolice || ""
      const apoliceB = b.propostaApolice?.numeroApolice || ""
      if (apoliceA !== apoliceB) return apoliceA.localeCompare(apoliceB)

      const seguradoA = a.propostaApolice?.seguradoNome || ""
      const seguradoB = b.propostaApolice?.seguradoNome || ""
      if (seguradoA !== seguradoB) return seguradoA.localeCompare(seguradoB)

      const produtorA = a.produtorNome || ""
      const produtorB = b.produtorNome || ""
      if (produtorA !== produtorB) return produtorA.localeCompare(produtorB)

      const parcelaA = a.parcela?.numeroParcela || 0
      const parcelaB = b.parcela?.numeroParcela || 0
      if (parcelaA !== parcelaB) return parcelaA - parcelaB

      // Sort parent before estornos
      if (!a.repasseEstornadoId && b.repasseEstornadoId) return -1
      if (a.repasseEstornadoId && !b.repasseEstornadoId) return 1

      return 0
    })
  }, [repassesData, produtores, propostas])

  if (isLoading) return <LoadingScreen />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Controle de Repasse</h3>
      </div>

      <FilterForm
        onFilter={handleFilter}
        fields={filterFields}
        defaultOpen={false}
        title="Filtros"
        appliedFilters={filters}
      />

      <div className="flex items-center gap-2">
        <Button
          className="flex items-center gap-1"
          variant="secondary"
          onClick={() => {
            const csv = generateCSV()
            downloadCSV(csv, "repasses")
          }}>
          <FileXls size={22} />
          Exportar Excel
        </Button>

        <ExportTableToPDFButton
          filename={`repasses.${new Date().toLocaleDateString("pt-BR").replace(/\//g, "-")}`}
          options={{ orientation: "landscape" }}
          title="Controle de Repasse"
          className="bg-red-500">
          Exportar PDF
        </ExportTableToPDFButton>
      </div>

      <div className="space-y-4">
        <Table columns={columns} data={rows} />

        <Pagination
          page={page}
          totalPages={repassesData?.totalPages || 1}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit)
            setPage(1)
          }}
        />
      </div>

      {baixaRepasse && (
        <BaixaRepasseModal
          repasse={baixaRepasse}
          onClose={() => setBaixaRepasse(null)}
          onConfirm={handleBaixar}
        />
      )}

      {editarRepasse && (
        <EditarValorRepasseModal
          repasse={editarRepasse}
          onClose={() => setEditarRepasse(null)}
          onConfirm={handleEditarValor}
        />
      )}

      {estornoRepasse && (
        <EstornoRepasseModal
          repasse={estornoRepasse}
          onClose={() => setEstornoRepasse(null)}
          onConfirm={handleEstornar}
        />
      )}

      {reverterEstorno && (
        <ReverterEstornoModal
          repasse={reverterEstorno}
          onClose={() => setReverterEstorno(null)}
          onConfirm={handleReverterEstorno}
        />
      )}
    </div>
  )
}
