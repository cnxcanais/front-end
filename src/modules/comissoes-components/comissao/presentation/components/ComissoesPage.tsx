"use client"

import { Comissao } from "@/@types/comissao"
import { Button } from "@/core/components/Button"
import { ExportTableToPDFButton } from "@/core/components/ExportPDFButton"
import { FilterField, FilterForm } from "@/core/components/FilterForm"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Pagination } from "@/core/components/Pagination"
import { Table } from "@/core/components/Table"
import { getCookie } from "@/lib/cookies"
import { useCorretoraQuery } from "@/modules/corretoras-components/corretora/infra/hooks/use-corretora-query"
import { EstornoComissaoModal } from "@/modules/estornos-components/estorno/presentation/components/modals/EstornoComissaoModal"
import { ReverterEstornoComissaoModal } from "@/modules/estornos-components/estorno/presentation/components/modals/ReverterEstornoComissaoModal"
import { usePropostaQuery } from "@/modules/propostas-components/propostas/infra/hooks/use-proposta-query"
import { useSeguradoraQuery } from "@/modules/seguradoras-components/seguradora/infra/hooks/use-seguradora-query"
import {
  ArrowCounterClockwise,
  Calculator,
  Eye,
  FileXls,
  Wallet,
} from "@phosphor-icons/react"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { useComissaoQuery } from "../../infra/hooks/use-comissao-query"
import { calcularComissoes } from "../../infra/remote"
import { ComissaoDetailsModal } from "./modals/ComissaoDetailsModal"
import { PagarComissaoModal } from "./modals/PagarComissaoModal"

export function ComissoesPage() {
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [selectedComissao, setSelectedComissao] =
    useState<Comissao.Type | null>(null)
  const [showPagarModal, setShowPagarModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showEstornoModal, setShowEstornoModal] = useState(false)
  const [showReverterModal, setShowReverterModal] = useState(false)

  const isAdmin = getCookie("perfilId") === process.env.NEXT_PUBLIC_ADM_ID
  const corretoraId = getCookie("corretoraId")

  const standardFilters = isAdmin ? {} : { corretoraId: corretoraId || "" }

  const {
    data: comissoesData,
    isLoading,
    refetch,
  } = useComissaoQuery(page, limit, {
    ...filters,
    ...standardFilters,
  })
  const { data: propostaData } = usePropostaQuery(1, -1, standardFilters)
  const { data: seguradoraData } = useSeguradoraQuery(1, -1)
  const { data: corretoraData } = useCorretoraQuery(1, -1)

  const handleFilter = (newFilters: Record<string, string>) => {
    setFilters(newFilters)
    setPage(1)
  }

  const handleCalcular = async () => {
    try {
      await calcularComissoes({})
      toast.success("Comissões calculadas com sucesso")
      refetch()
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Erro ao calcular comissões"
      )
    }
  }

  const filterFields: FilterField[] = useMemo(
    () => [
      {
        name: "situacaoComissao",
        label: "Situação",
        type: "select",
        placeholder: "Selecione a situação",
        options: [
          { label: "Simulada", value: "Simulada" },
          { label: "Provisionada", value: "Provisionada" },
          { label: "Pendente", value: "Pendente" },
          { label: "Paga", value: "Paga" },
          { label: "Cancelada", value: "Cancelada" },
        ],
      },
      {
        name: "corretoraId",
        label: "Corretora",
        type: "select",
        placeholder: "Selecione a corretora",
        options:
          isAdmin ?
            corretoraData?.data.map((c) => ({
              label: c.razaoSocial,
              value: c.id,
            })) || []
          : corretoraData?.data
              .filter((c) => c.id === corretoraId)
              .map((c) => ({
                label: c.razaoSocial,
                value: c.id,
              })) || [],
      },
      {
        name: "seguradoraId",
        label: "Seguradora",
        type: "select",
        placeholder: "Selecione a seguradora",
        options:
          seguradoraData?.data.map((s) => ({
            label: s.razaoSocial,
            value: s.id,
          })) || [],
      },
      {
        name: "propostaApoliceId",
        label: "Apólice",
        type: "select",
        placeholder: "Selecione a apólice",
        options:
          propostaData?.data.map((p) => ({
            label: p.numeroApolice,
            value: p.id,
          })) || [],
      },
      {
        name: "dataVencimentoInicio",
        label: "Vencimento (De)",
        type: "date",
      },
      {
        name: "dataVencimentoFim",
        label: "Vencimento (Até)",
        type: "date",
      },
    ],
    [corretoraData, seguradoraData, propostaData, isAdmin, corretoraId]
  )

  const columns = [
    {
      header: "Corretora",
      accessor: "corretoraNome",
      sortable: true,
      render: (v: string, row: any) => (
        <span className={(row as any).isNested ? "pl-8" : ""}>
          {(row as any).isNested && "↳ "}
          {row.corretoraNome}
        </span>
      ),
    },
    { header: "Seguradora", accessor: "seguradoraNome", sortable: true },
    { header: "Segurado", accessor: "seguradoNome", sortable: true },
    { header: "Apólice", accessor: "numeroApolice", sortable: true },
    { header: "Parcela", accessor: "numeroParcela", sortable: true },
    { header: "Vencimento", accessor: "dataVencimento", sortable: true },
    {
      header: "Comissão",
      accessor: "comissaoTotal",
      sortable: true,
      render: (value: string, row: any) => (
        <span
          className={row.valorComissao < 0 ? "font-semibold text-red-600" : ""}>
          {value}
        </span>
      ),
    },
    { header: "Pago", accessor: "valorPago", sortable: true },
    { header: "Pendente", accessor: "valorPendente", sortable: true },
    {
      header: "Situação",
      accessor: "situacao",
      sortable: true,
      render: (value: string, row: any) => {
        let adjustedValue = value
        if (row.comissaoEstornadaId && !row.isEstornoRevertido) {
          adjustedValue = "Estornado"
        } else if (row.comissaoEstornadaId && row.isEstornoRevertido) {
          adjustedValue = "Revertido"
        }
        const getSituacaoStyle = (situacao: string) => {
          switch (situacao) {
            case "Pendente":
              return "bg-yellow-100 text-yellow-800 border-yellow-300"
            case "Pago":
              return "bg-green-100 text-green-800 border-green-300"
            case "Parcial":
              return "bg-blue-100 text-blue-800 border-blue-300"
            case "Cancelado":
              return "bg-gray-100 text-gray-800 border-gray-300"
            case "Estornado":
              return "bg-red-100 text-red-800 border-red-300"
            case "Revertido":
              return "bg-red-100 text-red-400 border-red-300"
            default:
              return "bg-gray-100 text-gray-800 border-gray-300"
          }
        }
        return (
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getSituacaoStyle(adjustedValue)}`}>
            {adjustedValue}
          </span>
        )
      },
    },
    {
      header: "Atraso",
      accessor: "diasAtraso",
      sortable: true,
      render: (value: string, row: any) => {
        const dias = row.diasAtrasoOriginal
        let color = "#9ca3af" // cinza
        if (dias > 90)
          color = "#ef4444" // vermelho
        else if (dias > 30)
          color = "#f97316" // laranja
        else if (dias > 15) color = "#eab308" // amarelo

        return (
          <div className="flex items-center gap-2">
            <div
              className="rounded-full"
              style={{
                backgroundColor: color,
                width: "12px",
                height: "12px",
                minWidth: "12px",
                minHeight: "12px",
                flexShrink: 0,
              }}
            />
            <span>{value}</span>
          </div>
        )
      },
    },
    {
      header: "Ações",
      accessor: "actions",
      sortable: false,
      render: (value: React.ReactNode) => value,
    },
  ]

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR")
  }

  const generateCSV = () => {
    const headers = [
      "Segurado",
      "Apólice",
      "Parcela",
      "Vencimento",
      "Comissão",
      "Pago",
      "Pendente",
      "Situação",
      "Atraso",
    ]
    const csvRows = [
      headers.join(","),
      ...(comissoesData?.items.map((c) =>
        [
          c.seguradoNome,
          c.numeroApolice,
          c.numeroParcela,
          formatDate(c.dataVencimento),
          c.comissaoTotal,
          c.valorPago,
          c.valorPendente,
          c.situacao,
          c.diasAtraso > 0 ? `+${c.diasAtraso}` : "0",
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

  const rows = useMemo(() => {
    if (!comissoesData?.items) return []

    // Separate parent comissoes and estornos
    const parentComissoes = comissoesData.items.filter(
      (c) => !c.comissaoEstornadaId
    )
    const estornos = comissoesData.items.filter((c) => c.comissaoEstornadaId)

    // Sort parent comissoes
    const sortedParents = [...parentComissoes].sort((a, b) => {
      const corretoraA = a.corretoraNome || ""
      const corretoraB = b.corretoraNome || ""
      if (corretoraA !== corretoraB) return corretoraA.localeCompare(corretoraB)

      const seguradoraA = a.seguradoraNome || ""
      const seguradoraB = b.seguradoraNome || ""
      if (seguradoraA !== seguradoraB)
        return seguradoraA.localeCompare(seguradoraB)

      const seguradoA = a.seguradoNome || ""
      const seguradoB = b.seguradoNome || ""
      if (seguradoA !== seguradoB) return seguradoA.localeCompare(seguradoB)

      const apoliceA = a.numeroApolice || ""
      const apoliceB = b.numeroApolice || ""
      if (apoliceA !== apoliceB) return apoliceA.localeCompare(apoliceB)

      const parcelaA = Number(a.numeroParcela) || 0
      const parcelaB = Number(b.numeroParcela) || 0
      return parcelaA - parcelaB
    })

    // Nest estornos under their parent comissoes
    const result: any[] = []
    sortedParents.forEach((parent) => {
      result.push(parent)
      const relatedEstornos = [...estornos]
        .filter((e) => e.comissaoEstornadaId === parent.id)
        .sort((a, b) => {
          const parcelaA = Number(a.numeroParcela) || 0
          const parcelaB = Number(b.numeroParcela) || 0
          return parcelaA - parcelaB
        })
      relatedEstornos.forEach((estorno) => {
        result.push({ ...estorno, isNested: true })
      })
    })

    return result.map((comissao) => ({
      ...comissao,
      dataVencimento: formatDate(comissao.dataVencimento),
      comissaoTotalOriginal: comissao.comissaoTotal,
      comissaoTotal: formatCurrency(comissao.comissaoTotal),
      valorPago: formatCurrency(comissao.valorPago),
      valorPendente: formatCurrency(comissao.valorPendente),
      diasAtrasoOriginal: comissao.diasAtraso,
      diasAtraso: comissao.diasAtraso > 0 ? `+${comissao.diasAtraso}` : "0",
      actions: (
        <div className="flex gap-2">
          {comissao.situacao === "Pendente" && isAdmin && (
            <Button
              variant="tertiary"
              onClick={() => {
                setSelectedComissao(comissao)
                setShowPagarModal(true)
              }}
              className="flex items-center gap-2">
              <Wallet size={16} />
              Pagar
            </Button>
          )}
          {comissao.valorPago > 0 &&
            !comissao.comissaoEstornadaId &&
            isAdmin && (
              <Button
                variant="tertiary"
                onClick={() => {
                  setSelectedComissao(comissao)
                  setShowEstornoModal(true)
                }}
                className="flex items-center gap-2">
                <ArrowCounterClockwise size={16} />
                Estornar
              </Button>
            )}
          {comissao.comissaoEstornadaId &&
            !comissao.isEstornoRevertido &&
            isAdmin && (
              <Button
                variant="tertiary"
                onClick={() => {
                  setSelectedComissao(comissao)
                  setShowReverterModal(true)
                }}
                className="flex items-center gap-2">
                <ArrowCounterClockwise size={16} />
                Reverter
              </Button>
            )}
          <Button
            variant="tertiary"
            onClick={() => {
              setSelectedComissao(comissao)
              setShowDetailsModal(true)
            }}
            className="flex items-center gap-2">
            <Eye size={16} />
            Detalhe
          </Button>
        </div>
      ),
    }))
  }, [comissoesData, isAdmin])

  if (isLoading) return <LoadingScreen />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Controle de Comissões</h1>
        <Button onClick={handleCalcular} className="flex items-center gap-2">
          <Calculator size={16} />
          Calcular Comissões
        </Button>
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
            downloadCSV(csv, "comissoes")
          }}>
          <FileXls size={22} />
          Exportar Excel
        </Button>

        <ExportTableToPDFButton
          filename={`comissoes.${new Date().toLocaleDateString("pt-BR").replace(/\//g, "-")}`}
          options={{ orientation: "landscape" }}
          title="Controle de Comissões"
          className="bg-red-500">
          Exportar PDF
        </ExportTableToPDFButton>
      </div>

      <div className="space-y-4">
        <Table columns={columns} data={rows} enableSorting={true} />

        <Pagination
          page={page}
          totalPages={comissoesData?.totalPages || 1}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit)
            setPage(1)
          }}
        />
      </div>

      <PagarComissaoModal
        open={showPagarModal}
        onClose={() => {
          setShowPagarModal(false)
          setSelectedComissao(null)
        }}
        comissao={selectedComissao}
        onSuccess={() => refetch()}
      />

      <ComissaoDetailsModal
        open={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false)
          setSelectedComissao(null)
        }}
        comissao={selectedComissao}
      />

      {selectedComissao && (
        <EstornoComissaoModal
          open={showEstornoModal}
          onClose={() => {
            setShowEstornoModal(false)
            setSelectedComissao(null)
          }}
          comissao={selectedComissao}
          onSuccess={() => refetch()}
        />
      )}

      {selectedComissao && (
        <ReverterEstornoComissaoModal
          open={showReverterModal}
          onClose={() => {
            setShowReverterModal(false)
            setSelectedComissao(null)
          }}
          comissao={selectedComissao}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  )
}
