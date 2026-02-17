"use client"

import { Comissao } from "@/@types/comissao"
import { Button } from "@/core/components/Button"
import { FilterField, FilterForm } from "@/core/components/FilterForm"
import { LoadingScreen } from "@/core/components/LoadingScreen"
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
  const [selectedComissao, setSelectedComissao] =
    useState<Comissao.Type | null>(null)
  const [showPagarModal, setShowPagarModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showEstornoModal, setShowEstornoModal] = useState(false)
  const [showReverterModal, setShowReverterModal] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const isAdmin = getCookie("perfilId") === process.env.NEXT_PUBLIC_ADM_ID
  const corretoraId = getCookie("corretoraId")

  const standardFilters = isAdmin ? {} : { corretoraId: corretoraId || "" }

  const {
    data: comissoesData,
    isLoading,
    refetch,
  } = useComissaoQuery(page, 10, {
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
    } catch (error: any) {
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
      header: "",
      accessor: "checkbox",
      render: (value: React.ReactNode) => value,
    },
    { header: "Segurado", accessor: "seguradoNome" },
    { header: "Apólice", accessor: "numeroApolice" },
    { header: "Parcela", accessor: "numeroParcela" },
    { header: "Vencimento", accessor: "dataVencimento" },
    { header: "Comissão", accessor: "comissaoTotal" },
    { header: "Pago", accessor: "valorPago" },
    { header: "Pendente", accessor: "valorPendente" },
    { header: "Situação", accessor: "situacao" },
    { header: "Atraso", accessor: "diasAtraso" },
    {
      header: "Ações",
      accessor: "actions",
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

  const rows =
    comissoesData?.items.map((comissao) => ({
      ...comissao,
      checkbox: (
        <input
          type="checkbox"
          checked={selectedIds.includes(comissao.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedIds([...selectedIds, comissao.id])
            } else {
              setSelectedIds(selectedIds.filter((id) => id !== comissao.id))
            }
          }}
        />
      ),
      dataVencimento: formatDate(comissao.dataVencimento),
      comissaoTotal: formatCurrency(comissao.comissaoTotal),
      valorPago: formatCurrency(comissao.valorPago),
      valorPendente: formatCurrency(comissao.valorPendente),
      diasAtraso: comissao.diasAtraso > 0 ? `+${comissao.diasAtraso}` : "0",
      actions: (
        <div className="flex gap-2">
          {comissao.situacao === "Pendente" && (
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
          {comissao.valorPago > 0 && !comissao.comissaoEstornadaId && (
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
          {comissao.comissaoEstornadaId && !comissao.isEstornoRevertido && (
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
    })) || []

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

      <div className="flex justify-between">
        <div className="text-sm text-gray-600">
          {selectedIds.length > 0 && `${selectedIds.length} selecionado(s)`}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedIds(comissoesData?.items.map((c) => c.id) || [])
                } else {
                  setSelectedIds([])
                }
              }}
              checked={
                selectedIds.length > 0 &&
                selectedIds.length === comissoesData?.items.length
              }
            />
            <span className="text-sm text-gray-600">Selecionar todos</span>
          </div>
        </div>
        <Table columns={columns} data={rows} />

        {comissoesData && comissoesData.total > 10 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando {(page - 1) * 10 + 1} a{" "}
              {Math.min(page * 10, comissoesData.total)} de{" "}
              {comissoesData.total} resultados
            </div>
            <div className="flex gap-2">
              <Button
                variant="tertiary"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}>
                Anterior
              </Button>
              <Button
                variant="tertiary"
                onClick={() => setPage(page + 1)}
                disabled={page * 10 >= comissoesData.total}>
                Próximo
              </Button>
            </div>
          </div>
        )}
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
