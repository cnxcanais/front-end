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
import { useProposaQuery } from "@/modules/propostas-components/propostas/infra/hooks/use-proposta-query"
import { removeProposta } from "@/modules/propostas-components/propostas/infra/remote"
import { useRamoQuery } from "@/modules/ramos-components/ramos/infra/hooks/use-ramo-query"
import { useSeguradoraQuery } from "@/modules/seguradoras-components/seguradora/infra/hooks/use-seguradora-query"
import { useSeguradoQuery } from "@/modules/segurados-components/segurado/infra/hooks/use-segurado-query"
import { FileXls, Pencil, Trash } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

export function PropostasTable() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [filters, setFilters] = useState<Record<string, string>>({})
  const { data, isLoading, refetch } = useProposaQuery(page, limit, filters)
  const [ramoId, setRamoId] = useState("")
  const { push } = useRouter()

  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")
  const [filteredResults, setFilteredResults] = useState([])
  const [produtosOptions, setProdutosOptions] = useState([])

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
      const filteredProdutos = produtos.data.filter(
        (p) => p.ramoId === ramoId
      )
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

  const isProdutoDisabled = !filters.ramoId || isProdutosLoading
  const produtoPlaceholder =
    !filters.ramoId ? "Selecione um ramo primeiro"
    : isProdutosLoading ? "Carregando produtos..."
    : "Buscar por produto"

  const propostas = data?.data || []
  const totalPages = data?.meta?.totalPages || 1

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
    { header: "Número Proposta", accessor: "_numeroProposta" },
    { header: "Tipo Documento", accessor: "_tipoDocumento" },
    { header: "Origem", accessor: "_origem" },
    { header: "Situação", accessor: "_situacao" },
    { header: "Prêmio Líquido", accessor: "_premioLiquido" },
    { header: "Comissão", accessor: "_valorComissao" },
    { header: "Vigência Início", accessor: "_inicioVigencia" },
    { header: "Vigência Fim", accessor: "_fimVigencia" },
    {
      header: "Ações",
      accessor: "_id",
      render: (value: string) => (
        <div className="flex space-x-4">
          <Pencil
            className="cursor-pointer duration-300 ease-in-out hover:text-blue-500"
            size={24}
            onClick={() => handleEdit(value)}
          />
          <Trash
            className="cursor-pointer duration-300 ease-in-out hover:text-blue-500"
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

  const filterFields: FilterField[] = useMemo(
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
        options: seguradosOptions,
      },
      {
        name: "corretoraId",
        label: "Corretora",
        placeholder: "Buscar por corretora",
        type: "select",
        options: corretorasOptions,
      },
      {
        name: "produtorId",
        label: "Produtor",
        placeholder: "Buscar por produtor",
        type: "select",
        options: produtoresOptions,
      },
      {
        name: "seguradoraId",
        label: "Seguradora",
        placeholder: "Buscar por seguradora",
        type: "select",
        options: seguradoresOptions,
      },
      {
        name: "ramoId",
        label: "Ramo",
        placeholder: "Buscar por ramo",
        type: "select",
        options: ramosOptions,
      },
      {
        name: "produtoId",
        label: "Produto",
        placeholder: produtoPlaceholder,
        type: "select",
        options: produtosOptions,
      },
      {
        name: "tipoDocumento",
        label: "Tipo Documento",
        placeholder: "Buscar por tipo",
        type: "select",
        options: [
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
          { label: "Ativo", value: "Ativo" },
          { label: "Inativo", value: "Inativo" },
        ],
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
      {
        name: "search",
        label: "Complemento",
        placeholder: "Buscar por complemento",
      },
    ],
    [
      seguradosOptions,
      corretorasOptions,
      produtoresOptions,
      seguradoresOptions,
      ramosOptions,
      produtosOptions,
      produtoPlaceholder,
      isProdutoDisabled,
    ]
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
        fields={filterFields}
        onFilter={handleFilter}
        onSelectChange={(fieldName, value) => {
          if (fieldName === "ramoId") {
            setRamoId(value)
          }
        }}
        appliedFilters={filters}
      />

      <div className="mt-8 flex items-center justify-between">
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
          <Table columns={columns} data={filteredResults} />
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
