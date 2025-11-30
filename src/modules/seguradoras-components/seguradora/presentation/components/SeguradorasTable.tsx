"use client"

import { Button } from "@/core/components/Button"
import { ExportTableToPDFButton } from "@/core/components/ExportPDFButton"
import { FilterField, FilterForm } from "@/core/components/FilterForm"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { ModalFilesTrigger } from "@/core/components/Modals/ModalFiles/ModalFilesTrigger"
import { Pagination } from "@/core/components/Pagination"
import { Table } from "@/core/components/Table"
import { exportNoPagination } from "@/core/utils/exportToExcel/exportNoPagination"
import { useSeguradoraQuery } from "@/modules/seguradoras-components/seguradora/infra/hooks/use-seguradora-query"
import { removeSeguradora } from "@/modules/seguradoras-components/seguradora/infra/remote"
import { FileXls, Pencil, Trash } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export function SeguradorasTable() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [filters, setFilters] = useState<Record<string, string>>({})
  const { data, isLoading, refetch } = useSeguradoraQuery(page, limit, filters)
  const { push } = useRouter()

  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")

  const seguradoras = data?.data || []
  const totalPages = data?.totalPages || 1

  const handleEdit = (id: string) => {
    push(`/seguradoras/edit/${id}`)
  }

  const handleConfirmDelete = async () => {
    try {
      await removeSeguradora(id)
      toast.success("Seguradora removida com sucesso!")
      refetch()
    } catch (error) {
      const message =
        error?.response?.data?.message || "Erro ao remover seguradora"
      toast.error(message)
    } finally {
      setOpen(false)
    }
  }

  const brStates = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ]
  const ufOptions = brStates.map((uf) => ({
    label: uf,
    value: uf,
  }))

  const filterFields: FilterField[] = [
    {
      name: "razaoSocial",
      label: "Razão Social",
      placeholder: "Buscar por razão social",
    },
    { name: "cnpj", label: "CNPJ", placeholder: "Buscar por CNPJ" },
    {
      name: "uf",
      label: "UF",
      type: "select",
      options: ufOptions,
      placeholder: "Buscar por UF",
    },
    {
      name: "fantasia",
      label: "Nome Fantasia",
      placeholder: "Buscar por Nome Fantasia",
    },
  ]

  const handleFilter = (newFilters: Record<string, string>) => {
    setFilters(newFilters)
    setPage(1)
  }

  const columns = [
    { header: "Razão Social", accessor: "razaoSocial" },
    { header: "Nome Fantasia", accessor: "fantasia" },
    { header: "Documento", accessor: "cnpjFormatado" },
    { header: "Endereço", accessor: "enderecoCompleto" },
    { header: "Cidade", accessor: "cidade" },
    { header: "UF", accessor: "uf" },
    {
      header: "Arquivos",
      accessor: "id",
      render: (value: string) => (
        <ModalFilesTrigger entityId={value} entityType={"seguradora"} />
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

  if (isLoading) return <LoadingScreen />

  return (
    <>
      <Modal
        title="Remover Seguradora"
        content="Você tem certeza de que deseja remover esta seguradora?"
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
        <Button onClick={() => push("/seguradoras/create")} variant="secondary">
          Cadastrar
        </Button>
        {seguradoras.length > 0 && (
          <div className="flex items-center gap-2">
            <ExportTableToPDFButton
              filename={`seguradoras.${new Date().toLocaleDateString("pt-BR").replace(/\//g, "-")}`}
              options={{ orientation: "portrait" }}
              title="Seguradoras"
              className="bg-red-500">
              Exportar PDF
            </ExportTableToPDFButton>
            <Button
              className="flex items-center gap-1"
              variant="secondary"
              onClick={() => exportNoPagination("seguradoras")}>
              <FileXls size={22} />
              Exportar
            </Button>
          </div>
        )}
      </div>

      {seguradoras.length == 0 ?
        <h2 className="mt-6 text-xl font-semibold">
          Nenhum fornecedor cadastrado.
        </h2>
      : <>
          <Table columns={columns} data={seguradoras} />
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
