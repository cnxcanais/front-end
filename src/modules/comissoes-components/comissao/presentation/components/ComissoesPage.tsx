"use client"

import { Comissao } from "@/@types/comissao"
import { Button } from "@/core/components/Button"
import { FilterField, FilterForm } from "@/core/components/FilterForm"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Table } from "@/core/components/Table"
import { getCookie } from "@/lib/cookies"
import { useCorretoraQuery } from "@/modules/corretoras-components/corretora/infra/hooks/use-corretora-query"
import { usePropostaQuery } from "@/modules/propostas-components/propostas/infra/hooks/use-proposta-query"
import { useSeguradoQuery } from "@/modules/segurados-components/segurado/infra/hooks/use-segurado-query"
import { useSeguradoraQuery } from "@/modules/seguradoras-components/seguradora/infra/hooks/use-seguradora-query"
import { CurrencyDollar, Eye, Wallet } from "@phosphor-icons/react"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { baixarComissaoLote, getIndicadores } from "../../infra/remote"
import { useComissaoQuery } from "../../infra/hooks/use-comissao-query"
import { BaixaComissaoModal } from "./modals/BaixaComissaoModal"
import { ComissaoDetailsModal } from "./modals/ComissaoDetailsModal"

export function ComissoesPage() {
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [page, setPage] = useState(1)
  const [selectedComissao, setSelectedComissao] =
    useState<Comissao.Type | null>(null)
  const [showBaixaModal, setShowBaixaModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [indicadores, setIndicadores] = useState<Comissao.Indicadores | null>(
    null
  )

  const isAdmin = getCookie("perfilId") === process.env.NEXT_PUBLIC_ADM_ID
  const corretoraId = getCookie("corretoraId")

  const standardFilters = isAdmin ? {} : { corretoraId: corretoraId || "" }

  const { data: comissoesData, isLoading, refetch } = useComissaoQuery(page, 10, {
    ...filters,
    ...standardFilters,
  })
  const { data: propostaData } = usePropostaQuery(1, -1, standardFilters)
  const { data: seguradoraData } = useSeguradoraQuery(1, -1)
  const { data: seguradoData } = useSeguradoQuery(1, -1, standardFilters)
  const { data: corretoraData } = useCorretoraQuery(1, -1)

  useMemo(() => {
    getIndicadores({ ...filters, ...standardFilters })
      .then(setIndicadores)
      .catch(() => toast.error("Erro ao carregar indicadores"))
  }, [filters, standardFilters])

  const handleFilter = (newFilters: Record<string, string>) => {
    setFilters(newFilters)
    setPage(1)
  }

  const handleBaixaLote = async () => {
    if (selectedIds.length === 0) {
      toast.error("Selecione ao menos uma comissão")
      return
    }

    const dataPagamento = prompt("Data de pagamento (YYYY-MM-DD):")
    if (!dataPagamento) return

    try {
      await baixarComissaoLote({
        comissaoIds: selectedIds,
        dataPagamento,
        metodo: "Lote",
      })
      toast.success("Baixa em lote realizada com sucesso")
      setSelectedIds([])
      refetch()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Erro ao realizar baixa")
    }
  }

  const filterFields: FilterField[] = useMemo(
    () => [
      {
        name: "situacao",
        label: "Situação",
        type: "select",
        options: [
          { label: "Pendente", value: "PENDENTE" },
          { label: "Parcial", value: "PARCIAL" },
          { label: "Paga", value: "PAGA" },
          { label: "Cancelada", value: "CANCELADA" },
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
        name: "apoliceId",
        label: "Apólice",
        type: "select",
        options:
          propostaData?.data.map((p) => ({
            label: p.numeroApolice,
            value: p.id,
          })) || [],
      },
      {
        name: "seguradoId",
        label: "Segurado",
        type: "select",
        options:
          seguradoData?.data.map((s) => ({
            label: s.nomeRazaoSocial,
            value: s.id,
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
    [
      corretoraData,
      seguradoraData,
      propostaData,
      seguradoData,
      isAdmin,
      corretoraId,
    ]
  )

  const columns = [
    { header: "", accessor: "checkbox", render: (value: React.ReactNode) => value },
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
          {comissao.situacao !== "PAGA" &&
            comissao.situacao !== "CANCELADA" && (
              <Button
                variant="tertiary"
                onClick={() => {
                  setSelectedComissao(comissao)
                  setShowBaixaModal(true)
                }}
                className="flex items-center gap-2">
                <Wallet size={16} />
                Baixar
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
      <h1 className="text-2xl font-bold">Controle de Comissões</h1>

      {indicadores && (
        <div className="grid grid-cols-4 gap-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow">
            <div className="flex items-center gap-2">
              <CurrencyDollar size={24} className="text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Total Pendente</p>
                <p className="text-xl font-bold">
                  {formatCurrency(indicadores.totalPendente)}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow">
            <div className="flex items-center gap-2">
              <CurrencyDollar size={24} className="text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Pago no Mês</p>
                <p className="text-xl font-bold">
                  {formatCurrency(indicadores.totalPagoMes)}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow">
            <div className="flex items-center gap-2">
              <CurrencyDollar size={24} className="text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Total Vencido</p>
                <p className="text-xl font-bold">
                  {formatCurrency(indicadores.totalVencido)}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow">
            <p className="mb-2 text-sm font-semibold text-gray-700">Aging</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>0-30:</span>
                <span className="font-medium">
                  {formatCurrency(indicadores.aging.ate30)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>31-60:</span>
                <span className="font-medium">
                  {formatCurrency(indicadores.aging.de31a60)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>61-90:</span>
                <span className="font-medium">
                  {formatCurrency(indicadores.aging.de61a90)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>+90:</span>
                <span className="font-medium">
                  {formatCurrency(indicadores.aging.acima90)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

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
        {selectedIds.length > 0 && (
          <Button onClick={handleBaixaLote}>Baixa em Lote</Button>
        )}
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

      <BaixaComissaoModal
        open={showBaixaModal}
        onClose={() => {
          setShowBaixaModal(false)
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
    </div>
  )
}
