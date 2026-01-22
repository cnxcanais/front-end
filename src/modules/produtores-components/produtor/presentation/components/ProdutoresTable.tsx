"use client"

import { EntityType } from "@/@types/enums/entityType"
import { Button } from "@/core/components/Button"
import { ExportTableToPDFButton } from "@/core/components/ExportPDFButton"
import { FilterField, FilterForm } from "@/core/components/FilterForm"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { ModalFilesTrigger } from "@/core/components/Modals/ModalFiles/ModalFilesTrigger"
import { Pagination } from "@/core/components/Pagination"
import { Table } from "@/core/components/Table"
import { exportNoPagination } from "@/core/utils/exportToExcel/exportNoPagination"
import { useCorretoraQuery } from "@/modules/corretoras-components/corretora/infra/hooks/use-corretora-query"
import { useProdutorQuery } from "@/modules/produtores-components/produtor/infra/hooks/use-produtor-query"
import { FileXls, Pencil, Trash } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { removeProdutor } from "../../infra/remote/remove-produtor"

export function ProdutoresTable() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [filters, setFilters] = useState<Record<string, string>>({})
  const { data, isLoading, refetch } = useProdutorQuery(page, limit, filters)
  const { data: corretoras, isLoading: isLoadingCorretoras } =
    useCorretoraQuery()
  const { push } = useRouter()
  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")

  const [filteredResults, setFilteredResults] = useState([])

  const corretorasOptions = useMemo(() => {
    if (isLoadingCorretoras || !corretoras) return []
    return corretoras.data.map((corretora) => ({
      label: corretora.razaoSocial,
      value: corretora.id,
    }))
  }, [corretoras, isLoadingCorretoras])

  useEffect(() => {
    refetch()
  }, [])

  const produtores = data?.data || []
  const totalPages = data?.totalPages || 1

  const handleEdit = (id: string) => {
    push(`/produtores/edit/${id}`)
  }

  const handleConfirmDelete = async () => {
    try {
      await removeProdutor(id)
      toast.success("Produtor removido com sucesso!")
      refetch()
    } catch (error) {
      const message =
        error?.response?.data?.message || "Erro ao remover produtor"
      toast.error(message)
    } finally {
      setOpen(false)
    }
  }

  const columns = [
    { header: "Nome", accessor: "nome" },
    { header: "CPF/CNPJ", accessor: "cnpjCpf" },
    { header: "Situação", accessor: "situacao" },
    {
      header: "Corretora",
      accessor: "corretoraId",
      render: (value: string) => {
        const corretora = corretoras?.data?.find((c) => c.id === value)
        return corretora?.razaoSocial || value
      },
    },
    { header: "Cidade", accessor: "cidade" },
    { header: "UF", accessor: "uf" },
    {
      header: "Arquivos",
      accessor: "id",
      render: (value: string) => (
        <ModalFilesTrigger entityId={value} entityType={EntityType.PRODUTOR} />
      ),
    },
    {
      header: "Ações",
      accessor: "id",
      render: (value: string) => (
        <div className="flex space-x-4">
          <Pencil
            className="cursor-pointer duration-300 ease-in-out hover:text-blue-500"
            size={24}
            onClick={() => handleEdit(value)}
            color="#00dfa7"
          />
          <Trash
            className="cursor-pointer duration-300 ease-in-out hover:text-blue-500"
            size={24}
            onClick={() => {
              setId(value)
              setOpen(true)
            }}
            color="#00dfa7"
          />
        </div>
      ),
    },
  ]

  const filterFields: FilterField[] = [
    { name: "nome", label: "Nome", placeholder: "Buscar por Nome" },
    {
      name: "cnpjCpf",
      label: "CPF/CNPJ",
      placeholder: "Buscar por CPF ou CNPJ",
    },
    {
      name: "corretoraId",
      label: "Corretora",
      placeholder: "Buscar por Corretora",
      type: "select",
      options: corretorasOptions,
    },
    {
      name: "situacao",
      label: "Situação",
      placeholder: "Buscar por Situação",
      type: "select",
      options: [
        { label: "Ativo", value: "ATIVO" },
        { label: "Inativo", value: "INATIVO" },
      ],
    },
  ]

  const handleFilter = (newFilters: Record<string, string>) => {
    setFilters(newFilters)
    setPage(1)
  }

  useEffect(() => {
    if (produtores.length > 0) setFilteredResults(produtores)
  }, [produtores])

  if (isLoading) return <LoadingScreen />

  return (
    <>
      <Modal
        title="Remover Produtor"
        content="Você tem certeza de que deseja remover este produtor?"
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
        appliedFilters={filters}
      />

      <div className="mt-8 flex items-center justify-between">
        <div className="flex h-full gap-4">
          <Button
            onClick={() => push("/produtores/create")}
            variant="secondary">
            Cadastrar
          </Button>
        </div>
        {produtores.length > 0 && (
          <div className="flex items-center gap-2">
            <ExportTableToPDFButton
              filename={`produtores.${new Date().toLocaleDateString("pt-BR").replace(/\//g, "-")}`}
              options={{ orientation: "portrait" }}
              title="Produtores"
              className="bg-red-500">
              Exportar PDF
            </ExportTableToPDFButton>
            <Button
              className="flex items-center gap-1"
              variant="secondary"
              onClick={() => exportNoPagination("produtores")}>
              <FileXls size={22} />
              Exportar
            </Button>
          </div>
        )}
      </div>

      {produtores.length == 0 ?
        <h2 className="mt-6 text-xl font-semibold">
          Nenhum produtor cadastrado.
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
