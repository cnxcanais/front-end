"use client"

import { SinistroStatusEnum } from "@/@types/enums/sinistroEnum"
import { Sinistro } from "@/@types/sinistro"
import { Button } from "@/core/components/Button"
import { FilterField, FilterForm } from "@/core/components/FilterForm"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Table } from "@/core/components/Table"
import { useBaseFilter } from "@/core/hooks/useBaseFilter"
import { getCookie } from "@/lib/cookies"
import { useCorretoraQuery } from "@/modules/corretoras-components/corretora/infra/hooks/use-corretora-query"
import { usePropostaQuery } from "@/modules/propostas-components/propostas/infra/hooks/use-proposta-query"
import { useSeguradoQuery } from "@/modules/segurados-components/segurado/infra/hooks/use-segurado-query"
import { useSinistroQuery } from "@/modules/sinistros-components/sinistro/infra/hooks/use-sinistro-query"
import { SinistroDetailsModal } from "@/modules/sinistros-components/sinistro/presentation/components/modals/SinistroDetailsModal"
import { SinistroHistoryModal } from "@/modules/sinistros-components/sinistro/presentation/components/modals/SinistroHistoryModal"
import { useUsuarioQuery } from "@/modules/usuarios-components/usuario/infra/hooks/use-usuario-query"
import { ClockCounterClockwise, Eye } from "@phosphor-icons/react"
import { useMemo, useState } from "react"

export function SinistrosHistoricoPage() {
  const { data: usuarios } = useUsuarioQuery()
  const corretoraId = getCookie("corretoraId")
  const userId = getCookie("userId")
  const user = usuarios?.data.find((u) => u.props?.id === userId)
  const isAdmin = user?.props?.perfilId === process.env.NEXT_PUBLIC_ADM_ID

  const [filters, setFilters] = useState<Record<string, string>>({
    status: SinistroStatusEnum.HISTORICO,
  })
  const [page, setPage] = useState(1)
  const [selectedSinistro, setSelectedSinistro] =
    useState<Sinistro.Type | null>(null)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [selectedSinistroForHistory, setSelectedSinistroForHistory] = useState<{
    id: string
    numero: string
  } | null>(null)

  const standardFilters = useBaseFilter()
  const { data: propostaData } = usePropostaQuery(1, -1, standardFilters)
  const { data: seguradoraData } = useSeguradoQuery(1, -1, standardFilters)
  const { data: corretoraData } = useCorretoraQuery(1, -1)
  const { data: sinistrosData, isLoading } = useSinistroQuery(page, 10, {
    ...filters,
    ...standardFilters,
  })

  const handleFilter = (newFilters: Record<string, string>) => {
    setFilters({ ...newFilters, status: SinistroStatusEnum.HISTORICO })
    setPage(1)
  }

  const filterFields: FilterField[] = useMemo(
    () => [
      {
        name: "apoliceId",
        label: "Número de Apólice",
        type: "select",
        options:
          propostaData?.data.map((proposta) => ({
            label: proposta.numeroApolice,
            value: proposta.id,
          })) || [],
        placeholder: "Buscar por número de apólice",
      },
      {
        name: "numeroSinistro",
        label: "Número de Sinistro",
        type: "select",
        options:
          sinistrosData?.items.map((sinistro) => ({
            label: sinistro.numeroSinistro,
            value: sinistro.numeroSinistro,
          })) || [],
        placeholder: "Buscar por número de sinistro",
      },
      {
        name: "seguradoraId",
        label: "Seguradora",
        type: "select",
        options:
          seguradoraData?.data.map((seg) => ({
            label: seg.nomeRazaoSocial,
            value: seg.id,
          })) || [],
        placeholder: "Buscar por seguradora",
      },
      {
        name: "corretoraId",
        label: "Corretora",
        type: "select",
        options:
          isAdmin ?
            corretoraData?.data.map((seg) => ({
              label: seg.razaoSocial,
              value: seg.id,
            })) || []
          : corretoraData?.data
              .filter((c) => c.id === corretoraId)
              .map((seg) => ({
                label: seg.razaoSocial,
                value: seg.id,
              })) || [],
        placeholder: "Buscar por corretora",
      },
      {
        name: "dataInicio",
        label: "Vigência Inicial (De)",
        type: "date",
      },
      {
        name: "dataFim",
        label: "Vigência Inicial (Até)",
        type: "date",
      },
    ],
    [
      corretoraData,
      propostaData,
      sinistrosData,
      seguradoraData,
      isAdmin,
      corretoraId,
    ]
  )

  const columns = [
    { header: "Número", accessor: "numeroSinistro" },
    { header: "Apólice", accessor: "apolice", accessor2: "numeroApolice" },
    { header: "Segurado", accessor: "apolice", accessor2: "seguradoNome" },
    { header: "Seguradora", accessor: "apolice", accessor2: "seguradoraNome" },
    { header: "Data Ocorrido", accessor: "dataHoraOcorrido" },
    { header: "Status", accessor: "status" },
    {
      header: "Ações",
      accessor: "actions",
      render: (value: React.ReactNode) => value,
    },
  ]

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR")
  }

  const rows =
    sinistrosData?.items.map((sinistro) => ({
      ...sinistro,
      dataHoraOcorrido: formatDate(sinistro.dataHoraOcorrido),
      actions: (
        <div className="flex gap-2">
          <Button
            variant="tertiary"
            onClick={() => setSelectedSinistro(sinistro)}
            className="flex items-center gap-2">
            <Eye size={16} />
            Ver Detalhes
          </Button>
          <Button
            variant="tertiary"
            onClick={() => {
              setSelectedSinistroForHistory({
                id: sinistro.id,
                numero: sinistro.numeroSinistro,
              })
              setShowHistoryModal(true)
            }}
            className="flex items-center gap-2">
            <ClockCounterClockwise size={16} />
            Histórico
          </Button>
        </div>
      ),
    })) || []

  if (isLoading) return <LoadingScreen />

  return (
    <div className="space-y-6">
      <FilterForm
        onFilter={handleFilter}
        fields={filterFields}
        defaultOpen={false}
        title="Filtros"
        appliedFilters={filters}
      />

      <div className="space-y-4">
        <Table columns={columns} data={rows} />

        {sinistrosData && sinistrosData.total > 10 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando {(page - 1) * 10 + 1} a{" "}
              {Math.min(page * 10, sinistrosData.total)} de{" "}
              {sinistrosData.total} resultados
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
                disabled={page * 10 >= sinistrosData.total}>
                Próximo
              </Button>
            </div>
          </div>
        )}
      </div>

      <SinistroDetailsModal
        open={!!selectedSinistro}
        onClose={() => setSelectedSinistro(null)}
        sinistro={selectedSinistro}
        isAdmin={isAdmin || false}
      />

      <SinistroHistoryModal
        open={showHistoryModal}
        onClose={() => {
          setShowHistoryModal(false)
          setSelectedSinistroForHistory(null)
        }}
        sinistroId={selectedSinistroForHistory?.id || ""}
        sinistroNumero={selectedSinistroForHistory?.numero || ""}
      />
    </div>
  )
}
