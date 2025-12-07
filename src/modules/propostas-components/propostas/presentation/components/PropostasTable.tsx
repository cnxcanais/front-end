"use client"

import { Button } from "@/core/components/Button"
import { ExportTableToPDFButton } from "@/core/components/ExportPDFButton"
import { FilterField, FilterForm } from "@/core/components/FilterForm"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { Pagination } from "@/core/components/Pagination"
import { Table } from "@/core/components/Table"
import { exportNoPagination } from "@/core/utils/exportToExcel/exportNoPagination"
import { useCorretoraQuery } from "@/modules/corretoras-components/corretora/infra/hooks/use-corretora-query"
import { useProdutorQuery } from "@/modules/produtores-components/produtor/infra/hooks/use-produtor-query"
import { useProdutoQuery } from "@/modules/produtos-components/produtos/infra/hooks/use-produto-query"
import { usePropostaQuery } from "@/modules/propostas-components/propostas/infra/hooks/use-proposta-query"
import { removeProposta } from "@/modules/propostas-components/propostas/infra/remote"
import { useRamoQuery } from "@/modules/ramos-components/ramos/infra/hooks/use-ramo-query"
import { useSeguradoraQuery } from "@/modules/seguradoras-components/seguradora/infra/hooks/use-seguradora-query"
import { useSeguradoQuery } from "@/modules/segurados-components/segurado/infra/hooks/use-segurado-query"
import { FileXls, Pencil, Trash } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { DashboardIndicators } from "./DashboardIndicators"

export function PropostasTable() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [filters, setFilters] = useState<Record<string, string>>({})
  const { data, isLoading, refetch } = usePropostaQuery(page, limit, filters)
  const [ramoId, setRamoId] = useState("")
  const { push } = useRouter()

  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")
  const [filteredResults, setFilteredResults] = useState([])
  const [produtosOptions, setProdutosOptions] = useState([])
  const [expandedIds, setExpandedIds] = useState<string[]>([])

  const { data: segurados } = useSeguradoQuery(1, 100)
  const { data: corretoras } = useCorretoraQuery(1, 100)
  const { data: produtores } = useProdutorQuery(1, 100)
  const { data: seguradoras } = useSeguradoraQuery(1, 100)
  const { data: ramos } = useRamoQuery(1, 100)
  const { data: produtos, isLoading: isProdutosLoading } = useProdutoQuery(
    1,
    100
  )

  console.log("filters" + filters)

  useEffect(() => {
    if (ramoId && produtos?.data) {
      const filteredProdutos = produtos.data.filter((p) => p.ramoId === ramoId)
      const produtosOption = filteredProdutos.map((p) => ({
        label: p.descricao,
        value: p.id,
      }))
      setProdutosOptions(produtosOption)
    }
  }, [ramoId, produtos?.data])

  console.log(produtosOptions)

  const seguradosOptions = useMemo(() => {
    if (!segurados?.data) return []
    return segurados.data.map((s) => ({
      label: s.nomeRazaoSocial,
      value: s.id,
    }))
  }, [segurados])

  const corretorasOptions = useMemo(() => {
    if (!corretoras?.data) return []
    return corretoras.data.map((c) => ({
      label: c.razaoSocial,
      value: c.id,
    }))
  }, [corretoras])

  const produtoresOptions = useMemo(() => {
    if (!produtores?.data) return []
    return produtores.data.map((p) => ({
      label: p.nome,
      value: p.id,
    }))
  }, [produtores])

  const seguradoresOptions = useMemo(() => {
    if (!seguradoras?.data) return []
    return seguradoras.data.map((s) => ({
      label: s.razaoSocial,
      value: s.id,
    }))
  }, [seguradoras])

  const ramosOptions = useMemo(() => {
    if (!ramos?.data) return []
    return ramos.data.map((r) => ({
      label: r.descricao,
      value: r.id,
    }))
  }, [ramos])

  const propostas = data?.data || []
  const totalPages = data?.meta?.totalPages || 1

  const getSeguradoName = (id: string) =>
    segurados?.data?.find((s) => s.id === id)?.nomeRazaoSocial || ""
  const getProdutorName = (id: string) =>
    produtores?.data?.find((p) => p.id === id)?.nome || ""
  const getRamoName = (id: string) =>
    ramos?.data.find((r) => r.id === id)?.descricao || ""
  const getSeguradoraName = (id: string) =>
    seguradoras?.data?.find((s) => s.id === id)?.razaoSocial || ""
  const getCorretoraName = (id: string) =>
    corretoras?.data?.find((c) => c.id === id)?.razaoSocial || ""

  const handleEdit = (id: string) => {
    push(`/propostas/edit/${id}`)
  }

  const handleConfirmDelete = async () => {
    try {
      await removeProposta(id)
      toast.success("Proposta removida com sucesso!")
      refetch()
    } catch (error) {
      const message =
        error?.response?.data?.message || "Erro ao remover proposta"
      toast.error(message)
    } finally {
      setOpen(false)
    }
  }

  const columns = [
    {
      header: "",
      accessor: "_id",
      render: (value: string) => (
        <button
          onClick={() =>
            setExpandedIds(
              expandedIds.includes(value) ?
                expandedIds.filter((id) => id !== value)
              : [...expandedIds, value]
            )
          }
          className="font-bold text-blue-600">
          {expandedIds.includes(value) ? "v" : ">"}
        </button>
      ),
    },
    {
      header: "Segurado",
      accessor: "_seguradoId",
      render: (value: string) => (
        <span className="cursor-pointer text-red-600 hover:underline">
          {getSeguradoName(value)}
        </span>
      ),
    },
    {
      header: "Ramo",
      accessor: "_ramoId",
      render: (value: string, row: any) => (
        <div>
          <div>{getRamoName(value)}</div>
          <div className="text-sm text-gray-600">
            Vigência: {row._inicioVigencia} a {row._fimVigencia}
          </div>
          {row._primeiraParcela && (
            <div className="text-sm text-gray-600">
              1ª Parcela: {row._primeiraParcela}
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "_situacao",
      render: (value: string, row: any) => (
        <div className="flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${
              value === "Ativo" ? "bg-green-500"
              : value === "Pendente" ? "bg-yellow-500"
              : "bg-red-500"
            }`}
          />
          <div>
            <div className="font-medium">{row._tipoDocumento}</div>
            <div className="text-sm text-gray-600">{row._numeroProposta}</div>
            <div className="text-xs text-gray-500">
              {row._statusSecundario || ""}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Produtor",
      accessor: "_produtorId",
      render: (value: string) => getProdutorName(value),
    },
    {
      header: "Seguradora",
      accessor: "_seguradoraId",
      render: (value: string) => getSeguradoraName(value),
    },
    {
      header: "Ação",
      accessor: "_id",
      render: (value: string) => (
        <div className="flex gap-2">
          <Pencil
            className="cursor-pointer hover:text-blue-500"
            size={24}
            onClick={() => handleEdit(value)}
          />
          <Trash
            className="cursor-pointer hover:text-red-500"
            size={24}
            onClick={() => {
              setId(value)
              setOpen(true)
            }}
          />
        </div>
      ),
    },
  ]

  const quickSearchFields: FilterField[] = useMemo(
    () => [
      {
        name: "numeroProposta",
        label: "Número Proposta",
        placeholder: "Buscar por número",
      },
      {
        name: "seguradoId",
        label: "Segurado",
        placeholder: "Buscar por segurado",
        type: "select",
        options: [{ label: "Todos", value: "" }, ...seguradosOptions],
      },
      {
        name: "placaVeiculo",
        label: "Placa Veículo",
        placeholder: "Buscar por placa",
      },
      {
        name: "chassiVeiculo",
        label: "Chassi Veículo",
        placeholder: "Buscar por chassi",
      },
    ],
    [seguradosOptions]
  )

  const advancedSearchFields: FilterField[] = useMemo(
    () => [
      {
        name: "corretoraId",
        label: "Corretora",
        placeholder: "Buscar por corretora",
        type: "select",
        options: [{ label: "Todos", value: "" }, ...corretorasOptions],
      },
      {
        name: "produtorId",
        label: "Produtor",
        placeholder: "Buscar por produtor",
        type: "select",
        options: [{ label: "Todos", value: "" }, ...produtoresOptions],
      },
      {
        name: "seguradoraId",
        label: "Seguradora",
        placeholder: "Buscar por seguradora",
        type: "select",
        options: [{ label: "Todos", value: "" }, ...seguradoresOptions],
      },
      {
        name: "ramoId",
        label: "Ramo",
        placeholder: "Buscar por ramo",
        type: "select",
        options: [{ label: "Todos", value: "" }, ...ramosOptions],
      },
      {
        name: "produtoId",
        label: "Produto",
        type: "select",
        options: [{ label: "Todos", value: "" }, ...produtosOptions],
      },
      {
        name: "tipoDocumento",
        label: "Tipo Documento",
        placeholder: "Buscar por tipo",
        type: "select",
        options: [
          { label: "Todos", value: "" },
          { label: "Proposta", value: "Proposta" },
          { label: "Apólice", value: "Apólice" },
          { label: "Renovação", value: "Renovação" },
          { label: "Endosso", value: "Endosso" },
        ],
      },
      {
        name: "origem",
        label: "Origem",
        placeholder: "Buscar por origem",
        type: "select",
        options: [
          { label: "Todos", value: "" },
          { label: "Manual", value: "Manual" },
          { label: "Importação", value: "Importação" },
          { label: "Integração", value: "Integração" },
        ],
      },
      {
        name: "situacao",
        label: "Situação",
        placeholder: "Buscar por situação",
        type: "select",
        options: [
          { label: "Todos", value: "" },
          { label: "Ativo", value: "Ativo" },
          { label: "Inativo", value: "Inativo" },
        ],
      },
      {
        name: "search",
        label: "Complemento",
        placeholder: "Buscar por complemento",
      },
    ],
    [
      corretorasOptions,
      produtoresOptions,
      seguradoresOptions,
      ramosOptions,
      produtosOptions,
    ]
  )

  const filterSections = useMemo(
    () => [
      {
        title: "Busca Rápida",
        fields: quickSearchFields,
        defaultOpen: true,
      },
      {
        title: "Busca Avançada",
        fields: advancedSearchFields,
        defaultOpen: false,
      },
    ],
    [quickSearchFields, advancedSearchFields]
  )

  const handleFilter = (newFilters: Record<string, string>) => {
    const updatedFilters = { ...newFilters }
    if (!newFilters.ramoId) {
      delete updatedFilters.produtoId
    }
    setFilters(updatedFilters)
    setPage(1)
  }

  useEffect(() => {
    if (propostas.length > 0) setFilteredResults(propostas)
  }, [propostas])

  if (isLoading) return <LoadingScreen />

  return (
    <>
      <Modal
        title="Remover Proposta"
        content="Você tem certeza de que deseja remover esta proposta?"
        onClose={() => setOpen(false)}
        open={open}>
        <div className="flex items-center justify-center gap-4">
          <Button onClick={handleConfirmDelete} variant="secondary">
            Confirmar
          </Button>
          <Button onClick={() => setOpen(false)} variant="tertiary">
            Cancelar
          </Button>
        </div>
      </Modal>

      <FilterForm
        sections={filterSections}
        onFilter={handleFilter}
        defaultOpen={true}
        title="Filtros"
        onSelectChange={(fieldName, value) => {
          if (fieldName === "ramoId") {
            setRamoId(value)
          }
        }}
        appliedFilters={filters}
      />

      <DashboardIndicators
        onFilterChange={(filterType, value) => {
          // Handle filter changes from dashboard
        }}
      />

      <div className="flex items-center justify-between">
        <div className="flex h-full gap-4">
          <Button onClick={() => push("/propostas/create")} variant="secondary">
            Cadastrar
          </Button>
        </div>
        {propostas.length > 0 && (
          <div className="flex items-center gap-2">
            <ExportTableToPDFButton
              filename={`propostas.${new Date().toLocaleDateString("pt-BR").replace(/\//g, "-")}`}
              options={{ orientation: "landscape" }}
              title="Propostas"
              className="bg-red-500">
              Exportar PDF
            </ExportTableToPDFButton>
            <Button
              className="flex items-center gap-1"
              variant="secondary"
              onClick={() => exportNoPagination("propostas")}>
              <FileXls size={22} />
              Exportar
            </Button>
          </div>
        )}
      </div>

      {propostas.length == 0 ?
        <h2 className="mt-6 text-xl font-semibold">
          Nenhuma proposta cadastrada.
        </h2>
      : <>
          <Table
            columns={columns}
            data={filteredResults}
            expandedRowIds={expandedIds}
            expandedRowContent={(row: any) => (
              <div className="grid grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="mb-1 block font-medium text-gray-600">
                    Corretora
                  </label>
                  <input
                    type="text"
                    value={getCorretoraName(row._corretoraId)}
                    disabled
                    className="w-full rounded border bg-white px-2 py-1"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-gray-600">
                    Prêmio Líquido
                  </label>
                  <input
                    type="text"
                    value={row._premioLiquido || ""}
                    disabled
                    className="w-full rounded border bg-white px-2 py-1"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-gray-600">
                    Comissão
                  </label>
                  <input
                    type="text"
                    value={row._valorComissao || ""}
                    disabled
                    className="w-full rounded border bg-white px-2 py-1"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-gray-600">
                    Origem
                  </label>
                  <input
                    type="text"
                    value={row._origem || ""}
                    disabled
                    className="w-full rounded border bg-white px-2 py-1"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-gray-600">
                    Placa Veículo
                  </label>
                  <input
                    type="text"
                    value={row._placaVeiculo || ""}
                    disabled
                    className="w-full rounded border bg-white px-2 py-1"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-gray-600">
                    Chassi Veículo
                  </label>
                  <input
                    type="text"
                    value={row._chassiVeiculo || ""}
                    disabled
                    className="w-full rounded border bg-white px-2 py-1"
                  />
                </div>
              </div>
            )}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit)
              setPage(1)
            }}
          />
        </>
      }
    </>
  )
}
