"use client"

import { Button } from "@/core/components/Button"
import { FilterField, FilterForm } from "@/core/components/FilterForm"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { Pagination } from "@/core/components/Pagination"
import { Table } from "@/core/components/Table"
import { useCorretoraQuery } from "@/modules/corretoras-components/corretora/infra/hooks/use-corretora-query"
import { useProdutorQuery } from "@/modules/produtores-components/produtor/infra/hooks/use-produtor-query"
import { useProdutoQuery } from "@/modules/produtos-components/produtos/infra/hooks/use-produto-query"
import { usePropostaQuery } from "@/modules/propostas-components/propostas/infra/hooks/use-proposta-query"
import {
  exportPropostas,
  importPropostas,
  removeProposta,
} from "@/modules/propostas-components/propostas/infra/remote"
import { useRamoQuery } from "@/modules/ramos-components/ramos/infra/hooks/use-ramo-query"
import { useSeguradoraQuery } from "@/modules/seguradoras-components/seguradora/infra/hooks/use-seguradora-query"
import { useSeguradoQuery } from "@/modules/segurados-components/segurado/infra/hooks/use-segurado-query"
import { FileXls, Pencil, Trash } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { DashboardIndicators } from "./DashboardIndicators"
import { ExportPropostasModal } from "./ExportPropostasModal"
import { ImportPropostasModal } from "./ImportPropostasModal"

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
  const [openExportModal, setOpenExportModal] = useState(false)
  const [openImportModal, setOpenImportModal] = useState(false)

  const { data: segurados } = useSeguradoQuery(1, 100)
  const { data: corretoras } = useCorretoraQuery(1, 100)
  const { data: produtores } = useProdutorQuery(1, 100)
  const { data: seguradoras } = useSeguradoraQuery(1, 100)
  const { data: ramos } = useRamoQuery(1, 100)
  const { data: produtos } = useProdutoQuery(1, 100)

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

  const handleExport = async (exportFilters: Record<string, string>) => {
    try {
      const blob = await exportPropostas(exportFilters)
      const csvBlob = new Blob([blob], { type: "text/csv;charset=utf-8;" })
      const url = window.URL.createObjectURL(csvBlob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute(
        "download",
        `propostas-${new Date().toLocaleDateString("pt-BR").replace(/\//g, "-")}.csv`
      )
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      toast.success("Propostas exportadas com sucesso!")
    } catch (error) {
      console.error("Erro ao exportar propostas:", error)
    }
  }

  const handleImport = async (file: File) => {
    try {
      await importPropostas(file)
      toast.success("Propostas importadas com sucesso!")
      refetch()
    } catch (error) {
      console.error("Erro ao importar propostas:", error)
    }
  }

  const columns = [
    {
      header: "",
      accessor: "id",
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
      accessor: "seguradoId",
      render: (value: string) => (
        <span
          className="cursor-pointer text-red-600 hover:underline"
          onClick={() => push(`/segurados/edit/${value}`)}>
          {getSeguradoName(value)}
        </span>
      ),
    },
    {
      header: "Ramo",
      accessor: "ramoId",
      render: (value: string, row: any) => (
        <div>
          <div>{getRamoName(value)}</div>
          <div className="text-sm text-gray-600">
            Vigência: {row.inicioVigencia} a {row.fimVigencia}
          </div>
          {row.parcelas[0] && (
            <div className="text-sm text-gray-600">
              1º Parcela:{" "}
              {new Date(row.parcelas[0].dataVencimento).toLocaleDateString(
                "pt-BR"
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "situacao",
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
            <div className="font-medium">{row.tipoDocumento}</div>
            <div className="text-sm text-gray-600">{row.numeroProposta}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Produtor",
      accessor: "produtorId",
      render: (value: string) => getProdutorName(value),
    },
    {
      header: "Seguradora",
      accessor: "seguradoraId",
      render: (value: string) => getSeguradoraName(value),
    },
    {
      header: "Ação",
      accessor: "id",
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
      {
        name: "inicioVigenciaMin",
        label: "Vigência Inicial (De)",
        type: "date",
      },
      {
        name: "inicioVigenciaMax",
        label: "Vigência Inicial (Até)",
        type: "date",
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
        onFilterChange={(filterType, data) => {
          setFilteredResults(data)
          setPage(1)
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
            <Button
              className="flex items-center gap-1"
              variant="secondary"
              onClick={() => setOpenImportModal(true)}>
              <FileXls size={22} />
              Importar
            </Button>
            <Button
              className="flex items-center gap-1"
              variant="secondary"
              onClick={() => setOpenExportModal(true)}>
              <FileXls size={22} />
              Exportar
            </Button>
          </div>
        )}
      </div>

      <ExportPropostasModal
        open={openExportModal}
        onClose={() => setOpenExportModal(false)}
        onExport={handleExport}
        seguradosOptions={seguradosOptions}
        corretorasOptions={corretorasOptions}
        produtoresOptions={produtoresOptions}
        seguradoresOptions={seguradoresOptions}
        ramosOptions={ramosOptions}
        produtosOptions={produtosOptions}
      />

      <ImportPropostasModal
        open={openImportModal}
        onClose={() => setOpenImportModal(false)}
        onImport={handleImport}
      />

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
                    value={getCorretoraName(row.corretoraId)}
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
                    value={row.premioLiquido || ""}
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
                    value={row.valorComissao || ""}
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
                    value={row.origem || ""}
                    disabled
                    className="w-full rounded border bg-white px-2 py-1"
                  />
                </div>
                {row.placaVeiculo && (
                  <div>
                    <label className="mb-1 block font-medium text-gray-600">
                      Placa Veículo
                    </label>
                    <input
                      type="text"
                      value={row.placaVeiculo}
                      disabled
                      className="w-full rounded border bg-white px-2 py-1"
                    />
                  </div>
                )}
                {row.chassiVeiculo && (
                  <div>
                    <label className="mb-1 block font-medium text-gray-600">
                      Chassi Veículo
                    </label>
                    <input
                      type="text"
                      value={row.chassiVeiculo}
                      disabled
                      className="w-full rounded border bg-white px-2 py-1"
                    />
                  </div>
                )}
                {row.marcaVeiculo && (
                  <div>
                    <label className="mb-1 block font-medium text-gray-600">
                      Marca Veículo
                    </label>
                    <input
                      type="text"
                      value={row.marcaVeiculo}
                      disabled
                      className="w-full rounded border bg-white px-2 py-1"
                    />
                  </div>
                )}
                {row.modeloVeiculo && (
                  <div>
                    <label className="mb-1 block font-medium text-gray-600">
                      Modelo Veículo
                    </label>
                    <input
                      type="text"
                      value={row.modeloVeiculo}
                      disabled
                      className="w-full rounded border bg-white px-2 py-1"
                    />
                  </div>
                )}
                {row.anoFabricacaoVeiculo && (
                  <div>
                    <label className="mb-1 block font-medium text-gray-600">
                      Ano Fabricação
                    </label>
                    <input
                      type="text"
                      value={row.anoFabricacaoVeiculo}
                      disabled
                      className="w-full rounded border bg-white px-2 py-1"
                    />
                  </div>
                )}
                {row.anoModeloVeiculo && (
                  <div>
                    <label className="mb-1 block font-medium text-gray-600">
                      Ano Modelo
                    </label>
                    <input
                      type="text"
                      value={row.anoModeloVeiculo}
                      disabled
                      className="w-full rounded border bg-white px-2 py-1"
                    />
                  </div>
                )}
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
