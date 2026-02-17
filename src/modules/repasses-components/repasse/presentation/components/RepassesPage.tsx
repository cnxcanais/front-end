"use client"

import { Repasse } from "@/@types/repasse"
import { Button } from "@/core/components/Button"
import { FilterField, FilterForm } from "@/core/components/FilterForm"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Table } from "@/core/components/Table"
import { getCookie } from "@/lib/cookies"
import { useCorretoraQuery } from "@/modules/corretoras-components/corretora/infra/hooks/use-corretora-query"
import { useProdutorQuery } from "@/modules/produtores-components/produtor/infra/hooks/use-produtor-query"
import { usePropostaQuery } from "@/modules/propostas-components/propostas/infra/hooks/use-proposta-query"
import { useSeguradoraQuery } from "@/modules/seguradoras-components/seguradora/infra/hooks/use-seguradora-query"
import { CurrencyDollar, Eye, Wallet } from "@phosphor-icons/react"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { useRepasseQuery } from "../../infra/hooks/use-repasse-query"
import { baixarRepasseLote, getIndicadores } from "../../infra/remote"
import { BaixaRepasseModal } from "./modals/BaixaRepasseModal"
import { RepasseDetailsModal } from "./modals/RepasseDetailsModal"

export function RepassesPage() {
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [page, setPage] = useState(1)
  const [selectedRepasse, setSelectedRepasse] = useState<Repasse.Type | null>(
    null
  )
  const [showBaixaModal, setShowBaixaModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [indicadores, setIndicadores] = useState<Repasse.Indicadores | null>(
    null
  )

  const isAdmin = getCookie("perfilId") === process.env.NEXT_PUBLIC_ADM_ID
  const corretoraId = getCookie("corretoraId")

  const standardFilters = useMemo(
    () => (isAdmin ? {} : { corretoraId: corretoraId || "" }),
    [isAdmin, corretoraId]
  )

  const { data: repassesData, isLoading, refetch } = useRepasseQuery(page, 10, {
    ...filters,
    ...standardFilters,
  })
  const { data: propostaData } = usePropostaQuery(1, -1, standardFilters)
  const { data: seguradoraData } = useSeguradoraQuery(1, -1)
  const { data: produtorData } = useProdutorQuery(1, -1)
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
      toast.error("Selecione ao menos um repasse")
      return
    }

    const dataPagamento = prompt("Data de pagamento (YYYY-MM-DD):")
    if (!dataPagamento) return

    try {
      await baixarRepasseLote({
        repasseIds: selectedIds,
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
        name: "produtorId",
        label: "Produtor",
        type: "select",
        options:
          produtorData?.data.map((p) => ({
            label: p.nome,
            value: p.id,
          })) || [],
      },
      {
        name: "situacao",
        label: "Situação",
        type: "select",
        options: [
          { label: "Pendente", value: "PENDENTE" },
          { label: "Parcial", value: "PARCIAL" },
          { label: "Pago", value: "PAGO" },
          { label: "Cancelado", value: "CANCELADO" },
          { label: "Estornado", value: "ESTORNADO" },
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
        name: "periodoInicio",
        label: "Período (De)",
        type: "date",
      },
      {
        name: "periodoFim",
        label: "Período (Até)",
        type: "date",
      },
    ],
    [
      produtorData,
      corretoraData,
      seguradoraData,
      propostaData,
      isAdmin,
      corretoraId,
    ]
  )

  const columns = [
    { header: "", accessor: "checkbox", render: (value: React.ReactNode) => value },
    { header: "Produtor", accessor: "produtorNome" },
    { header: "Apólice", accessor: "numeroApolice" },
    { header: "Parcela", accessor: "numeroParcela" },
    { header: "Comissão Recebida", accessor: "comissaoRecebida" },
    { header: "Base", accessor: "baseCalculo" },
    { header: "Tipo", accessor: "tipo" },
    { header: "Valor Total", accessor: "valorTotal" },
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

  const rows =
    repassesData?.items.map((repasse) => ({
      ...repasse,
      checkbox: (
        <input
          type="checkbox"
          checked={selectedIds.includes(repasse.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedIds([...selectedIds, repasse.id])
            } else {
              setSelectedIds(selectedIds.filter((id) => id !== repasse.id))
            }
          }}
        />
      ),
      comissaoRecebida: formatCurrency(repasse.comissaoRecebida),
      tipo:
        repasse.valorFixo ?
          `Fixo: ${formatCurrency(repasse.valorFixo)}`
        : `${repasse.percentual}%`,
      valorTotal: formatCurrency(repasse.valorTotal),
      valorPago: formatCurrency(repasse.valorPago),
      valorPendente: formatCurrency(repasse.valorPendente),
      diasAtraso: repasse.diasAtraso > 0 ? `+${repasse.diasAtraso}` : "0",
      actions: (
        <div className="flex gap-2">
          {repasse.situacao !== "PAGO" &&
            repasse.situacao !== "CANCELADO" &&
            repasse.situacao !== "ESTORNADO" && (
              <Button
                variant="tertiary"
                onClick={() => {
                  setSelectedRepasse(repasse)
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
              setSelectedRepasse(repasse)
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
      <h1 className="text-2xl font-bold">Controle de Repasses</h1>

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
                  setSelectedIds(repassesData?.items.map((r) => r.id) || [])
                } else {
                  setSelectedIds([])
                }
              }}
              checked={
                selectedIds.length > 0 &&
                selectedIds.length === repassesData?.items.length
              }
            />
            <span className="text-sm text-gray-600">Selecionar todos</span>
          </div>
        </div>
        <Table columns={columns} data={rows} />

        {repassesData && repassesData.total > 10 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando {(page - 1) * 10 + 1} a{" "}
              {Math.min(page * 10, repassesData.total)} de{" "}
              {repassesData.total} resultados
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
                disabled={page * 10 >= repassesData.total}>
                Próximo
              </Button>
            </div>
          </div>
        )}
      </div>

      <BaixaRepasseModal
        open={showBaixaModal}
        onClose={() => {
          setShowBaixaModal(false)
          setSelectedRepasse(null)
        }}
        repasse={selectedRepasse}
        onSuccess={() => refetch()}
      />

      <RepasseDetailsModal
        open={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false)
          setSelectedRepasse(null)
        }}
        repasse={selectedRepasse}
      />
    </div>
  )
}
